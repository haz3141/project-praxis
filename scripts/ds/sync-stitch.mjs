#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readCsv } from "./lib/csv.mjs";
import { nowIso, writeJson, writeText } from "./lib/io.mjs";

const TARGET_PROJECTS = [
  ["13394915692903823935", "Praxis UI Kit — Calm"],
  ["5764765102702214376", "Praxis UI Kit — Executive"],
  ["7285948406539466076", "Praxis UI Kit — Minimal"],
  ["5252820721296843802", "Praxis UI Kit — Desktop"]
];

function runCatalogExport() {
  const out = spawnSync("pnpm", ["run", "stitch:catalog"], {
    stdio: "inherit",
    env: process.env
  });
  if (out.status !== 0) {
    throw new Error("stitch:catalog failed.");
  }
}

function computeInventory(rows) {
  const groups = new Map();

  for (const row of rows) {
    const key = row.project_id;
    if (!groups.has(key)) {
      groups.set(key, {
        project_id: key,
        project_title: row.project_title,
        rows: []
      });
    }
    groups.get(key).rows.push(row);
  }

  const projects = [...groups.values()].map((project) => {
    const slotCoverage = { "00": 0, "01": 0, "02": 0, "03": 0, "04": 0, "05": 0 };
    const uniqueSlots = new Set();
    let duplicates = 0;
    let unmapped = 0;

    for (const row of project.rows) {
      const slot = row.slot_code;
      if (slotCoverage[slot] !== undefined) {
        slotCoverage[slot] += 1;
        uniqueSlots.add(slot);
      }
      if (row.within_project_duplicate === "true") duplicates += 1;
      if (slot === "UNMAPPED") unmapped += 1;
    }

    return {
      project_id: project.project_id,
      project_title: project.project_title,
      total_screens: project.rows.length,
      canonical_coverage: `${uniqueSlots.size}/6`,
      duplicate_count: duplicates,
      unmapped_count: unmapped,
      slot_coverage: slotCoverage
    };
  });

  const index = new Map(projects.map((p) => [p.project_id, p]));
  for (const [id, title] of TARGET_PROJECTS) {
    if (!index.has(id)) {
      throw new Error(`Missing required Stitch project in catalog: ${title} (${id})`);
    }
  }

  const totalScreens = projects.reduce((acc, p) => acc + p.total_screens, 0);
  return {
    generated_at: nowIso(),
    source_command: "pnpm run stitch:catalog",
    projects: projects.sort((a, b) => a.project_title.localeCompare(b.project_title)),
    totals: {
      project_count: projects.length,
      screen_count: totalScreens
    }
  };
}

function buildExportsMarkdown(rows, inventory) {
  const generatedAt = inventory.generated_at;
  const projectMap = new Map();
  for (const row of rows) {
    if (!projectMap.has(row.project_id)) {
      projectMap.set(row.project_id, {
        title: row.project_title,
        rows: []
      });
    }
    projectMap.get(row.project_id).rows.push(row);
  }

  const lines = [
    "# Praxis UI Kit Export Index",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Canonical Project Snapshots"
  ];

  for (const [projectId, title] of TARGET_PROJECTS) {
    const project = projectMap.get(projectId);
    if (!project) continue;
    const sorted = project.rows
      .slice()
      .sort((a, b) => {
        if (a.slot_code !== b.slot_code) return a.slot_code.localeCompare(b.slot_code);
        return Number(a.within_project_duplicate_rank || 0) - Number(b.within_project_duplicate_rank || 0);
      });
    const firstBySlot = new Map();
    for (const row of sorted) {
      if (!firstBySlot.has(row.slot_code) && row.slot_code !== "UNMAPPED") {
        firstBySlot.set(row.slot_code, row);
      }
    }

    lines.push("", `### ${title}`, `- Project ID: \`${projectId}\``, "");
    lines.push("| Slot | Screen Title | Screen ID | htmlCode | Screenshot |");
    lines.push("|---|---|---|---|---|");
    for (const slot of ["00", "01", "02", "03", "04", "05"]) {
      const row = firstBySlot.get(slot);
      if (!row) continue;
      lines.push(`| ${slot} | ${row.title} | \`${row.screen_id}\` | ${row.has_html} | ${row.has_screenshot} |`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function main() {
  runCatalogExport();
  const rows = readCsv("docs/design-system/stitch/screens-catalog.csv");
  const inventory = computeInventory(rows);
  writeJson("docs/design-system/registry/data/stitch-inventory.json", inventory);
  writeText("docs/design-system/stitch/exports.md", buildExportsMarkdown(rows, inventory));
  console.log(`[ds:sync:stitch] projects=${inventory.totals.project_count} screens=${inventory.totals.screen_count}`);
}

try {
  main();
} catch (error) {
  console.error(`[ds:sync:stitch] ${error.message}`);
  process.exit(1);
}
