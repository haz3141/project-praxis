#!/usr/bin/env node

const eventName = process.env.GITHUB_EVENT_NAME ?? "";
const baseRef = process.env.GITHUB_BASE_REF ?? "";
const headRef = process.env.GITHUB_HEAD_REF ?? "";

const allowedFeaturePrefix = /^(feat|fix|docs|chore)\/[a-z0-9._-]+$/;
const allowedReleaseHeadsForMain = [/^chore\/dev-to-main-[a-z0-9._-]+$/, /^release\/[a-z0-9._-]+$/];

function isApprovedReleaseHeadForMain(branch) {
  return branch === "dev" || allowedReleaseHeadsForMain.some((pattern) => pattern.test(branch));
}

if (eventName !== "pull_request") {
  console.log("[branch-policy] Non-PR event. Skipping branch policy gate.");
  process.exit(0);
}

const failures = [];

if (!headRef) {
  failures.push("Missing GITHUB_HEAD_REF for pull_request event.");
}

// Default policy: all pull requests target `dev`.
// Release exception: PRs to `main` are allowed only from approved release heads.
if (baseRef !== "dev") {
  if (!(baseRef === "main" && isApprovedReleaseHeadForMain(headRef))) {
    failures.push(
      "PR base branch must be 'dev' unless this is an approved release PR to 'main' " +
        `(received base='${baseRef || "<empty>"}', head='${headRef || "<empty>"}').`
    );
  }
}

if (headRef) {
  if (baseRef === "main") {
    if (!isApprovedReleaseHeadForMain(headRef)) {
      failures.push(
        "PRs to 'main' are release-only and must come from 'dev', " +
          "'chore/dev-to-main-*', or 'release/*' " +
          `(received '${headRef}').`
      );
    }
  } else {
    if (headRef === "main" || headRef === "dev") {
      failures.push(`PR head branch must be short-lived, not '${headRef}'.`);
    }

    if (!allowedFeaturePrefix.test(headRef)) {
      failures.push(
        "PR head branch must match '(feat|fix|docs|chore)/<short-name>' " +
          `(received '${headRef}').`
      );
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[branch-policy] ${failure}`);
  }
  process.exit(1);
}

console.log(`[branch-policy] OK: ${headRef} -> ${baseRef}`);
