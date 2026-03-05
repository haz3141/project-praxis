#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readCsv } from "./lib/csv.mjs";
import { nowIso, writeJson, writeText } from "./lib/io.mjs";

const CORE_CANONICAL_PROJECTS = [
  ["13394915692903823935", "Praxis UI Kit — Calm"],
  ["5764765102702214376", "Praxis UI Kit — Executive"],
  ["7285948406539466076", "Praxis UI Kit — Minimal"],
  ["5252820721296843802", "Praxis UI Kit — Desktop"]
];
const LIQUID_NEON_PROJECT_ID = (
  process.env.STITCH_LIQUID_NEON_PROJECT_ID || "970655054511238677"
).trim();
const LIQUID_NEON_PROJECT_TITLE =
  (process.env.STITCH_LIQUID_NEON_PROJECT_TITLE || "Praxis UI Kit — Liquid Neon").trim();
const OPTIONAL_TRACKED_PROJECTS = LIQUID_NEON_PROJECT_ID
  ? [[LIQUID_NEON_PROJECT_ID, LIQUID_NEON_PROJECT_TITLE]]
  : [];
const TRACKED_PROJECTS = [...CORE_CANONICAL_PROJECTS, ...OPTIONAL_TRACKED_PROJECTS];
const CANONICAL_SLOTS = ["00", "01", "02", "03", "04", "05"];
const REPRESENTATIVE_PRIORITY = [
  ["5764765102702214376", "Praxis UI Kit — Executive"],
  ["13394915692903823935", "Praxis UI Kit — Calm"],
  ["7285948406539466076", "Praxis UI Kit — Minimal"],
  ["5252820721296843802", "Praxis UI Kit — Desktop"]
];

function rankWithinSlot(row) {
  const rank = Number(row.within_project_duplicate_rank || "0");
  return Number.isFinite(rank) && rank > 0 ? rank : 999;
}

function buildCanonicalSlots(rows) {
  const projectPriority = new Map(REPRESENTATIVE_PRIORITY.map(([id], index) => [id, index]));
  const perProjectSlot = new Map();

  for (const row of rows) {
    if (!CANONICAL_SLOTS.includes(row.slot_code)) continue;
    const key = `${row.project_id}:${row.slot_code}`;
    if (!perProjectSlot.has(key)) perProjectSlot.set(key, []);
    perProjectSlot.get(key).push(row);
  }

  const canonicalSlots = [];

  for (const slotCode of CANONICAL_SLOTS) {
    const canonicalScreens = [];

    for (const [projectId, projectTitle] of CORE_CANONICAL_PROJECTS) {
      const key = `${projectId}:${slotCode}`;
      const rowsForSlot = (perProjectSlot.get(key) || []).slice().sort((a, b) => {
        const rankDelta = rankWithinSlot(a) - rankWithinSlot(b);
        if (rankDelta !== 0) return rankDelta;
        return String(a.screen_id).localeCompare(String(b.screen_id));
      });

      const selected = rowsForSlot[0];
      if (!selected) {
        throw new Error(
          `Missing canonical slot ${slotCode} for project ${projectTitle} (${projectId}).`
        );
      }

      canonicalScreens.push({
        project_id: projectId,
        project_title: projectTitle,
        screen_id: selected.screen_id,
        title: selected.title,
        width: Number(selected.width || 0),
        height: Number(selected.height || 0)
      });
    }

    const sortedHeights = canonicalScreens.map((screen) => screen.height).sort((a, b) => a - b);
    const medianHeight =
      sortedHeights.length % 2 === 1
        ? sortedHeights[(sortedHeights.length - 1) / 2]
        : (sortedHeights[sortedHeights.length / 2 - 1] + sortedHeights[sortedHeights.length / 2]) / 2;

    const representative = canonicalScreens
      .slice()
      .sort((a, b) => {
        const distDelta = Math.abs(a.height - medianHeight) - Math.abs(b.height - medianHeight);
        if (distDelta !== 0) return distDelta;
        return (projectPriority.get(a.project_id) ?? 999) - (projectPriority.get(b.project_id) ?? 999);
      })[0];

    canonicalSlots.push({
      slot_code: slotCode,
      slot_label:
        canonicalScreens[0]?.title.replace(/^\d{2}\s+[—-]\s+/u, "").replace(/\s+UI Kit$/iu, "") || slotCode,
      canonical_screens: canonicalScreens,
      representative_screen_id: representative.screen_id,
      representative_project_id: representative.project_id,
      representative_height: representative.height,
      representative_selection: "median-height-by-slot-with-priority-tiebreak"
    });
  }

  return canonicalSlots;
}

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
  const groups = new Map(
    TRACKED_PROJECTS.map(([project_id, project_title]) => [
      project_id,
      {
        project_id,
        project_title,
        rows: []
      }
    ])
  );

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
    let unmapped = 0;
    const slotCounts = new Map();

    for (const row of project.rows) {
      const slot = row.slot_code;
      if (slotCoverage[slot] !== undefined) {
        slotCoverage[slot] += 1;
        uniqueSlots.add(slot);
        slotCounts.set(slot, (slotCounts.get(slot) || 0) + 1);
      }
      if (slot === "UNMAPPED") unmapped += 1;
    }

    let duplicates = 0;
    for (const count of slotCounts.values()) {
      if (count > 1) duplicates += count - 1;
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
  for (const [id, title] of TRACKED_PROJECTS) {
    if (!index.has(id)) {
      throw new Error(`Missing required Stitch project in catalog: ${title} (${id})`);
    }
  }

  const totalScreens = projects.reduce((acc, p) => acc + p.total_screens, 0);
  const canonicalSlots = buildCanonicalSlots(rows);
  return {
    generated_at: nowIso(),
    source_command: "pnpm run stitch:catalog",
    projects: projects.sort((a, b) => a.project_title.localeCompare(b.project_title)),
    canonical_policy: {
      strategy: "cross-variant-slot-matrix",
      representative_rule: "median-height-by-slot-with-project-priority-tiebreak",
      project_priority: REPRESENTATIVE_PRIORITY.map(([project_id, project_title]) => ({
        project_id,
        project_title
      }))
    },
    canonical_slots: canonicalSlots,
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
    "## Cross-Variant Canonical Slots",
    "",
    "| Slot | Representative Screen | Representative Project | Screen IDs by Variant |",
    "|---|---|---|---|"
  ];

  for (const slot of inventory.canonical_slots || []) {
    const representative = slot.canonical_screens.find(
      (screen) => screen.project_id === slot.representative_project_id
    );
    const representativeProject = representative
      ? `${representative.project_title} (\`${representative.project_id}\`)`
      : slot.representative_project_id;
    const byVariant = slot.canonical_screens
      .map((screen) => `${screen.project_title}: \`${screen.screen_id}\``)
      .join("; ");
    lines.push(
      `| ${slot.slot_code} | \`${slot.representative_screen_id}\` | ${representativeProject} | ${byVariant} |`
    );
  }

  lines.push("", "## Canonical Project Snapshots");

  for (const [projectId, title] of CORE_CANONICAL_PROJECTS) {
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

  if (OPTIONAL_TRACKED_PROJECTS.length) {
    lines.push("", "## Additional Kit Snapshots");
    for (const [projectId, title] of OPTIONAL_TRACKED_PROJECTS) {
      const project = projectMap.get(projectId);
      if (!project) {
        lines.push("", `### ${title}`, `- Project ID: \`${projectId}\``, "", "- No screens captured yet.");
        continue;
      }
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
