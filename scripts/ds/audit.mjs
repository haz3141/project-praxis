#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { nowIso, readJson, writeText } from "./lib/io.mjs";

const RUN_STEPS = [
  ["ds:sync:gallery", ["run", "ds:sync:gallery"]],
  ["ds:sync:stitch", ["run", "ds:sync:stitch"]],
  ["ds:build:patterns", ["run", "ds:build:patterns"]],
  ["ds:validate", ["run", "ds:validate"]]
];

function runPnpm(label, args) {
  const result = spawnSync("pnpm", args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    throw new Error(`${label} failed`);
  }
}

function makeAuditReport() {
  const generatedAt = nowIso();
  const gallery = readJson("docs/design-system/registry/data/component-gallery-components.json");
  const systems = readJson("docs/design-system/registry/data/design-systems.json");
  const stitch = readJson("docs/design-system/registry/data/stitch-inventory.json");
  const components = readJson("docs/design-system/registry/data/component-definitions.json");
  const patterns = readJson("docs/design-system/registry/data/pattern-definitions.json");

  const covered = components.components.filter((c) => c.status === "covered").length;
  const partial = components.components.filter((c) => c.status === "partial").length;
  const missing = components.components.filter((c) => c.status === "missing").length;

  const report = `# Praxis DS Audit Report\n\nGenerated: ${generatedAt}\n\n## Executive Metrics\n\n- Stitch projects audited: **${stitch.totals.project_count}**\n- Stitch screens audited: **${stitch.totals.screen_count}**\n- Component Gallery components crawled: **${gallery.components.length}**\n- Component Gallery design systems crawled: **${systems.systems.length}**\n- Component definitions: **${components.components.length}**\n- Pattern definitions: **${patterns.patterns.length}**\n\n## Coverage Summary\n\n- Covered: **${covered}**\n- Partial: **${partial}**\n- Missing: **${missing}**\n\n## Stitch Inventory Completeness\n\n${stitch.projects
  .map(
    (p) =>
      `- ${p.project_title} (${p.project_id}): total=${p.total_screens}, canonical=${p.canonical_coverage}, duplicates=${p.duplicate_count}, unmapped=${p.unmapped_count}`
  )
  .join("\\n")}\n\n## Drift Notes\n\n- Component baseline reference: 60 components. Live crawl this run: ${gallery.components.length}.\n- Any non-60 result is treated as live-source drift and captured in this report.\n\n## Required Output Check\n\n- [x] Local DS docs audit summary\n- [x] Live Stitch projects/screens audit\n- [x] Component-gallery coverage report\n- [x] Registry JSON + schemas\n- [x] CLI scaffold (ds:*)\n\n`;

  writeText("docs/design-system/registry/reports/audit-2026-03-03.md", report);

  const driftReport = `# Praxis DS Drift Report\n\nGenerated: ${generatedAt}\n\n## Summary\n\n- Live component.gallery count: ${gallery.components.length}\n- Baseline expected count: 60\n- Delta: ${gallery.components.length - 60}\n\n## Stitch Drift\n\n${stitch.projects
  .map(
    (p) =>
      `- ${p.project_title}: ${p.total_screens} screens, canonical slots ${p.canonical_coverage}, duplicates ${p.duplicate_count}, unmapped ${p.unmapped_count}`
  )
  .join("\\n")}\n`;

  writeText("docs/design-system/registry/reports/drift-report-2026-03-03.md", driftReport);

  const backlog = components.components
    .filter((component) => component.status !== "covered")
    .map((component, idx) => `${idx + 1}. ${component.name} — ${component.status} (tier: ${component.atomic_tier})`)
    .join("\n");

  writeText(
    "docs/design-system/registry/reports/remediation-backlog-2026-03-03.md",
    `# Praxis DS Remediation Backlog\n\nGenerated: ${generatedAt}\n\n## Prioritized Backlog\n\n${backlog || "No remediation backlog items."}\n`
  );
}

function main() {
  for (const [label, args] of RUN_STEPS) {
    runPnpm(label, args);
  }

  makeAuditReport();
  console.log("[ds:audit] completed full DS audit pipeline.");
}

try {
  main();
} catch (error) {
  console.error(`[ds:audit] ${error.message}`);
  process.exit(1);
}
