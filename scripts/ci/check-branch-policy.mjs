#!/usr/bin/env node

const eventName = process.env.GITHUB_EVENT_NAME ?? "";
const baseRef = process.env.GITHUB_BASE_REF ?? "";
const headRef = process.env.GITHUB_HEAD_REF ?? "";

const allowedFeaturePrefix = /^(feat|fix|docs|chore)\/[a-z0-9._-]+$/;

if (eventName !== "pull_request") {
  console.log("[branch-policy] Non-PR event. Skipping branch policy gate.");
  process.exit(0);
}

const failures = [];

if (baseRef !== "dev") {
  failures.push(`PR base branch must be 'dev' (received '${baseRef || "<empty>"}').`);
}

if (!headRef) {
  failures.push("Missing GITHUB_HEAD_REF for pull_request event.");
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

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`[branch-policy] ${failure}`);
  }
  process.exit(1);
}

console.log(`[branch-policy] OK: ${headRef} -> ${baseRef}`);
