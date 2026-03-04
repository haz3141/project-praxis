#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const OUTPUT_MD = "docs/design-system/stitch/screens-catalog.md";
const OUTPUT_CSV = "docs/design-system/stitch/screens-catalog.csv";
const DEFAULT_MCP_URL = "https://stitch.googleapis.com/mcp";
const DEFAULT_LIQUID_NEON_PROJECT_ID = "970655054511238677";

const CORE_CANONICAL_PROJECTS = [
  { label: "Praxis UI Kit — Calm", id: "13394915692903823935" },
  { label: "Praxis UI Kit — Executive", id: "5764765102702214376" },
  { label: "Praxis UI Kit — Minimal", id: "7285948406539466076" },
  { label: "Praxis UI Kit — Desktop", id: "5252820721296843802" }
];
const LIQUID_NEON_PROJECT_ID = (
  process.env.STITCH_LIQUID_NEON_PROJECT_ID || DEFAULT_LIQUID_NEON_PROJECT_ID
).trim();
const LIQUID_NEON_PROJECT_LABEL = (
  process.env.STITCH_LIQUID_NEON_PROJECT_LABEL || "Praxis UI Kit — Liquid Neon"
).trim();
const LIQUID_NEON_SEED_SCREEN_IDS = [
  "c8e36a8dac8941bc97f17ac3772433a4",
  "7a302ae01226457c98b44fef65854034",
  "1caa757d3a7148c88c837ccb2542ba6b",
  "9083bce8beb94c6a804e608e61bfd0a0",
  "bded73207d764dc0977557e0a7ffa6a7",
  "1770a27735f845a3aa69910d93bd7256"
];
const SEEDED_SCREEN_IDS_BY_PROJECT = new Map(
  LIQUID_NEON_PROJECT_ID === DEFAULT_LIQUID_NEON_PROJECT_ID
    ? [[LIQUID_NEON_PROJECT_ID, LIQUID_NEON_SEED_SCREEN_IDS]]
    : []
);
const OPTIONAL_TRACKED_PROJECTS = LIQUID_NEON_PROJECT_ID
  ? [{ label: LIQUID_NEON_PROJECT_LABEL, id: LIQUID_NEON_PROJECT_ID }]
  : [];
const TARGET_PROJECTS = [...CORE_CANONICAL_PROJECTS, ...OPTIONAL_TRACKED_PROJECTS];

const SLOT_ORDER = ["00", "01", "02", "03", "04", "05", "UNMAPPED"];
const CANONICAL_SLOT_SET = new Set(["00", "01", "02", "03", "04", "05"]);

const CSV_COLUMNS = [
  "project_title",
  "project_id",
  "screen_id",
  "screen_name_path",
  "title",
  "title_normalized",
  "slot_code",
  "slot_label_normalized",
  "is_canonical_slot",
  "is_variant_title",
  "is_explicit_variant",
  "width",
  "height",
  "aspect_ratio",
  "pixel_area",
  "device_type",
  "has_screenshot",
  "screenshot_file_name",
  "has_html",
  "html_file_name",
  "has_figma_export",
  "within_project_slot_count",
  "within_project_duplicate",
  "within_project_duplicate_rank",
  "cross_variant_slot_count"
];

let rpcId = 1;

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function extractTomlString(raw, keyName) {
  const pattern = new RegExp(`^\\s*${keyName}\\s*=\\s*"([^"]+)"`, "m");
  const match = raw.match(pattern);
  return match ? match[1] : null;
}

function resolveAuth() {
  const envToken = process.env.STITCH_OAUTH_ACCESS_TOKEN;
  if (envToken) {
    return {
      source: "env:STITCH_OAUTH_ACCESS_TOKEN",
      mode: "oauth",
      headers: { Authorization: `Bearer ${envToken}` }
    };
  }

  const envApiKey = process.env.STITCH_API_KEY;
  if (envApiKey) {
    return {
      source: "env:STITCH_API_KEY",
      mode: "api_key",
      headers: { "X-Goog-Api-Key": envApiKey }
    };
  }

  const home = os.homedir();
  const codexConfigPath = path.join(home, ".codex", "config.toml");
  const codexRaw = readFileSafe(codexConfigPath);
  if (codexRaw.includes("[mcp_servers.stitch")) {
    const codexAuth = extractTomlString(codexRaw, "Authorization");
    if (codexAuth) {
      return {
        source: "local:~/.codex/config.toml",
        mode: "oauth",
        headers: { Authorization: codexAuth }
      };
    }

    const codexApiKey = extractTomlString(codexRaw, "X-Goog-Api-Key");
    if (codexApiKey) {
      return {
        source: "local:~/.codex/config.toml",
        mode: "api_key",
        headers: { "X-Goog-Api-Key": codexApiKey }
      };
    }
  }

  const geminiConfigPath = path.join(home, ".gemini", "antigravity", "mcp_config.json");
  const geminiRaw = readFileSafe(geminiConfigPath);
  if (geminiRaw) {
    try {
      const geminiConfig = JSON.parse(geminiRaw);
      const headers = geminiConfig?.mcpServers?.stitch?.headers || {};
      if (typeof headers.Authorization === "string" && headers.Authorization) {
        return {
          source: "local:~/.gemini/antigravity/mcp_config.json",
          mode: "oauth",
          headers: { Authorization: headers.Authorization }
        };
      }
      if (typeof headers["X-Goog-Api-Key"] === "string" && headers["X-Goog-Api-Key"]) {
        return {
          source: "local:~/.gemini/antigravity/mcp_config.json",
          mode: "api_key",
          headers: { "X-Goog-Api-Key": headers["X-Goog-Api-Key"] }
        };
      }
    } catch {
      // Ignore malformed local config.
    }
  }

  throw new Error(
    "Missing Stitch credentials. Set STITCH_API_KEY or STITCH_OAUTH_ACCESS_TOKEN, or configure local Stitch MCP auth in ~/.codex/config.toml"
  );
}

async function mcpRequest(url, authHeaders, method, params) {
  const payload = {
    jsonrpc: "2.0",
    id: rpcId++,
    method,
    params
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...authHeaders
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response from MCP (${response.status}): ${text.slice(0, 300)}`);
  }

  if (parsed.error) {
    throw new Error(`MCP error ${parsed.error.code}: ${parsed.error.message}`);
  }

  return parsed.result;
}

function parseToolText(result) {
  if (!result || typeof result !== "object") {
    throw new Error("Invalid tool result payload.");
  }

  if (result.isError) {
    const errText = result.content?.[0]?.text || "Unknown tool error";
    throw new Error(`Tool call failed: ${errText}`);
  }

  const text = result.content?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Tool output missing text payload.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Tool output was not valid JSON: ${text.slice(0, 300)}`);
  }
}

async function callTool(url, authHeaders, name, args) {
  const result = await mcpRequest(url, authHeaders, "tools/call", {
    name,
    arguments: args
  });
  return parseToolText(result);
}

async function hydrateSeededScreens(url, authHeaders, projectId, seedIds) {
  const screens = [];
  for (const screenId of seedIds) {
    try {
      const screen = await callTool(url, authHeaders, "get_screen", {
        name: `projects/${projectId}/screens/${screenId}`
      });
      if (screen && typeof screen === "object" && screen.name) {
        screens.push(screen);
      }
    } catch {
      // Ignore missing seed IDs to keep sync resilient.
    }
  }
  return screens;
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeTitle(title) {
  return normalizeWhitespace(title).replace(/\s+UI Kit$/i, "").trim();
}

function parseSlot(titleNormalized) {
  const match = titleNormalized.match(/^(\d{2})\s+[—-]\s+(.+)$/);
  if (!match) {
    return {
      slotCode: "UNMAPPED",
      slotLabel: titleNormalized || "(untitled)",
      canonical: false
    };
  }

  const slotCode = match[1];
  const slotLabel = match[2].trim();
  return {
    slotCode,
    slotLabel,
    canonical: CANONICAL_SLOT_SET.has(slotCode)
  };
}

function parseScreenId(screenNamePath) {
  const parts = String(screenNamePath || "").split("/");
  return parts[parts.length - 1] || "";
}

function parseFileName(fileObj) {
  if (!fileObj || typeof fileObj.name !== "string") return "";
  return fileObj.name;
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatAspectRatio(width, height) {
  if (!width || !height) return "";
  return (width / height).toFixed(4);
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[,"\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function boolString(value) {
  return value ? "true" : "false";
}

function slotSortKey(slotCode) {
  const index = SLOT_ORDER.indexOf(slotCode);
  return index === -1 ? SLOT_ORDER.length : index;
}

function projectOrderMap() {
  const map = new Map();
  TARGET_PROJECTS.forEach((project, index) => {
    map.set(project.id, index);
  });
  return map;
}

function countDuplicateOverflowRows(projectRows) {
  const slotCounts = new Map();
  for (const row of projectRows) {
    if (row.slot_code === "UNMAPPED") continue;
    slotCounts.set(row.slot_code, (slotCounts.get(row.slot_code) || 0) + 1);
  }

  let overflowCount = 0;
  for (const count of slotCounts.values()) {
    if (count > 1) overflowCount += count - 1;
  }
  return overflowCount;
}

function buildProjectProfiles(projectById, rows) {
  return TARGET_PROJECTS.map((project) => {
    const projectRows = rows.filter((row) => row.project_id === project.id);
    const canonicalSlots = new Set(projectRows.filter((row) => row.slot_code !== "UNMAPPED").map((row) => row.slot_code));
    const duplicateCount = countDuplicateOverflowRows(projectRows);

    const unmappedCount = projectRows.filter((row) => row.slot_code === "UNMAPPED").length;

    const theme = projectById.get(project.id)?.designTheme || {};

    return {
      project_title: project.label,
      project_id: project.id,
      total_screens: projectRows.length,
      canonical_coverage: `${canonicalSlots.size}/6`,
      duplicate_count: duplicateCount,
      unmapped_count: unmappedCount,
      color_mode: theme.colorMode || "",
      font: theme.font || "",
      roundness: theme.roundness || "",
      custom_color: theme.customColor || ""
    };
  });
}

function buildCrossSlotStats(rows) {
  const canonicalProjectIds = new Set(CORE_CANONICAL_PROJECTS.map((project) => project.id));
  const slotToProjects = new Map();
  for (const row of rows) {
    if (!CANONICAL_SLOT_SET.has(row.slot_code)) continue;
    if (!canonicalProjectIds.has(row.project_id)) continue;
    const key = row.slot_code;
    if (!slotToProjects.has(key)) slotToProjects.set(key, new Set());
    slotToProjects.get(key).add(row.project_id);
  }

  for (const row of rows) {
    row.cross_variant_slot_count = CANONICAL_SLOT_SET.has(row.slot_code)
      ? String(slotToProjects.get(row.slot_code)?.size || 0)
      : "";
  }
}

function buildRepresentativeMatrix(rows) {
  const canonicalProjectIds = new Set(CORE_CANONICAL_PROJECTS.map((project) => project.id));
  const matrix = new Map();

  const sorted = [...rows].sort((a, b) => {
    if (a.slot_code !== b.slot_code) return slotSortKey(a.slot_code) - slotSortKey(b.slot_code);
    if (a.project_title !== b.project_title) return a.project_title.localeCompare(b.project_title);
    if (a.is_variant_title !== b.is_variant_title) return a.is_variant_title ? 1 : -1;
    if (a.within_project_duplicate_rank !== b.within_project_duplicate_rank) {
      return Number(a.within_project_duplicate_rank) - Number(b.within_project_duplicate_rank);
    }
    return a.screen_id.localeCompare(b.screen_id);
  });

  for (const row of sorted) {
    if (!CANONICAL_SLOT_SET.has(row.slot_code)) continue;
    if (!canonicalProjectIds.has(row.project_id)) continue;
    const key = `${row.slot_code}::${row.project_id}`;
    if (!matrix.has(key)) matrix.set(key, row);
  }

  return matrix;
}

function markdownTable(headers, rows) {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separatorRow = `|${headers.map(() => "---").join("|")}|`;
  const body = rows.map((row) => `| ${headers.map((header) => row[header] ?? "").join(" | ")} |`);
  return [headerRow, separatorRow, ...body].join("\n");
}

function computeWithinVariantSlotRows(rows, projectId) {
  const projectRows = rows.filter((row) => row.project_id === projectId);
  const grouped = new Map();

  for (const row of projectRows) {
    const key = row.slot_code;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const result = [];
  for (const slotCode of SLOT_ORDER) {
    if (!grouped.has(slotCode)) continue;
    const slotRows = grouped.get(slotCode);
    const heights = slotRows.map((row) => Number(row.height)).filter((n) => Number.isFinite(n));
    const minHeight = heights.length ? String(Math.min(...heights)) : "";
    const maxHeight = heights.length ? String(Math.max(...heights)) : "";

    result.push({
      slot_code: slotCode,
      slot_label: slotCode === "UNMAPPED" ? "Unmapped" : slotRows[0].slot_label_normalized,
      screen_count: String(slotRows.length),
      screen_ids: slotRows.map((row) => row.screen_id).join(", "),
      title_variants: slotRows.map((row) => row.title).join("; "),
      min_height: minHeight,
      max_height: maxHeight
    });
  }

  return result;
}

function buildDriftNotes(rows) {
  const liveByProject = new Map();
  for (const row of rows) {
    liveByProject.set(row.project_id, (liveByProject.get(row.project_id) || 0) + 1);
  }

  const notes = TARGET_PROJECTS.map(
    (project) =>
      `- Live catalog currently has ${liveByProject.get(project.id) || 0} screens for ${project.label} (\`${project.id}\`).`
  );
  notes.push(
    "- Canonical slot matrix is computed from the core four kits (Calm, Executive, Minimal, Desktop)."
  );
  if (OPTIONAL_TRACKED_PROJECTS.length) {
    notes.push(
      "- Additional kits (for example Liquid Neon) are tracked separately and intentionally excluded from canonical representative selection."
    );
  }
  notes.push(
    "- Pattern registry remains a canonical-6 baseline, while this catalog captures the full live screen set (including duplicates and unmapped screens)."
  );
  return notes;
}

function buildMarkdown(rows, projectProfiles, representativeMatrix, generatedAt) {
  const fullLedgerHeaders = [
    "project_title",
    "slot_code",
    "title",
    "screen_id",
    "width",
    "height",
    "device_type",
    "within_project_duplicate",
    "within_project_duplicate_rank",
    "is_variant_title",
    "is_explicit_variant",
    "has_screenshot",
    "has_html"
  ];

  const profileHeaders = [
    "project_title",
    "project_id",
    "total_screens",
    "canonical_coverage",
    "duplicate_count",
    "unmapped_count",
    "color_mode",
    "font",
    "roundness",
    "custom_color"
  ];

  const sections = [];
  sections.push("# Praxis Stitch Full Screen Catalog");
  sections.push("");
  sections.push(`Generated: ${generatedAt}`);
  sections.push(`Source command: \`pnpm run stitch:catalog\``);
  sections.push(`Total screens cataloged: **${rows.length}**`);
  sections.push("");
  sections.push("## Project Profiles");
  sections.push("");
  sections.push(markdownTable(profileHeaders, projectProfiles));
  sections.push("");
  sections.push("## Full Screen Ledger");
  sections.push("");
  sections.push(markdownTable(fullLedgerHeaders, rows));
  sections.push("");

  sections.push("## Within-Variant Comparison");
  sections.push("");

  for (const project of TARGET_PROJECTS) {
    sections.push(`### ${project.label}`);
    sections.push("");

    const slotRows = computeWithinVariantSlotRows(rows, project.id);
    sections.push(
      markdownTable(
        ["slot_code", "slot_label", "screen_count", "screen_ids", "title_variants", "min_height", "max_height"],
        slotRows
      )
    );

    const duplicateOverflowCount = rows.filter(
      (row) =>
        row.project_id === project.id &&
        row.within_project_duplicate === "true" &&
        Number(row.within_project_duplicate_rank) > 1
    ).length;

    const unmapped = rows.filter(
      (row) => row.project_id === project.id && row.slot_code === "UNMAPPED"
    );

    sections.push("");
    sections.push(`- Duplicate overflow rows in variant: **${duplicateOverflowCount}**`);
    if (unmapped.length) {
      sections.push(`- Unmapped rows: ${unmapped.map((row) => `${row.screen_id} (${row.title})`).join("; ")}`);
    } else {
      sections.push("- Unmapped rows: none");
    }
    sections.push("");
  }

  sections.push("## Cross-Variant Canonical Slot Matrix");
  sections.push("");

  const matrixRows = [];
  for (const slotCode of ["00", "01", "02", "03", "04", "05"]) {
    const row = { slot_code: slotCode };
    for (const project of CORE_CANONICAL_PROJECTS) {
      const key = `${slotCode}::${project.id}`;
      const rep = representativeMatrix.get(key);
      row[project.label] = rep ? `${rep.screen_id} (${rep.width}x${rep.height})` : "";
    }
    matrixRows.push(row);
  }

  sections.push(markdownTable(["slot_code", ...CORE_CANONICAL_PROJECTS.map((p) => p.label)], matrixRows));
  sections.push("");

  sections.push("## Cross-Variant Dimension Spread by Slot");
  sections.push("");

  const spreadRows = [];
  for (const slotCode of ["00", "01", "02", "03", "04", "05"]) {
    const slotRows = rows.filter((row) => row.slot_code === slotCode);
    const heights = slotRows.map((row) => Number(row.height)).filter((n) => Number.isFinite(n));
    const widths = slotRows.map((row) => Number(row.width)).filter((n) => Number.isFinite(n));

    const minH = heights.length ? Math.min(...heights) : "";
    const maxH = heights.length ? Math.max(...heights) : "";
    const minW = widths.length ? Math.min(...widths) : "";
    const maxW = widths.length ? Math.max(...widths) : "";

    spreadRows.push({
      slot_code: slotCode,
      rows: String(slotRows.length),
      min_width: String(minW),
      max_width: String(maxW),
      min_height: String(minH),
      max_height: String(maxH),
      height_delta: minH === "" ? "" : String(Number(maxH) - Number(minH))
    });
  }

  sections.push(markdownTable(["slot_code", "rows", "min_width", "max_width", "min_height", "max_height", "height_delta"], spreadRows));
  sections.push("");

  sections.push("## Drift Notes");
  sections.push("");
  for (const note of buildDriftNotes(rows)) {
    sections.push(note);
  }
  sections.push("");

  return `${sections.join("\n")}\n`;
}

function buildCsv(rows) {
  const lines = [CSV_COLUMNS.join(",")];
  for (const row of rows) {
    lines.push(CSV_COLUMNS.map((column) => csvEscape(row[column])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const mcpUrl = process.env.STITCH_MCP_URL || DEFAULT_MCP_URL;
  const auth = resolveAuth();

  console.log("Stitch screen catalog export");
  console.log(`- mcp_url: ${mcpUrl}`);
  console.log(`- auth_mode: ${auth.mode}`);
  console.log(`- auth_source: ${auth.source}`);

  const projectById = new Map();
  const projectRows = [];

  for (const project of TARGET_PROJECTS) {
    const projectData = await callTool(mcpUrl, auth.headers, "get_project", {
      name: `projects/${project.id}`
    });
    projectById.set(project.id, projectData);

    const screensData = await callTool(mcpUrl, auth.headers, "list_screens", {
      projectId: project.id
    });

    let screens = Array.isArray(screensData?.screens) ? screensData.screens : [];
    if (!screens.length) {
      const seededIds = SEEDED_SCREEN_IDS_BY_PROJECT.get(project.id) || [];
      if (seededIds.length) {
        const seededScreens = await hydrateSeededScreens(mcpUrl, auth.headers, project.id, seededIds);
        if (seededScreens.length) {
          screens = seededScreens;
          console.log(
            `- ${project.label}: recovered ${seededScreens.length} seeded screens via get_screen fallback`
          );
        }
      }
    }

    for (const screen of screens) {
      const title = normalizeWhitespace(screen.title || "");
      const titleNormalized = normalizeTitle(title);
      const slot = parseSlot(titleNormalized);

      const width = asNumber(screen.width);
      const height = asNumber(screen.height);
      const screenId = parseScreenId(screen.name);

      projectRows.push({
        project_title: project.label,
        project_id: project.id,
        screen_id: screenId,
        screen_name_path: screen.name || "",
        title,
        title_normalized: titleNormalized,
        slot_code: slot.slotCode,
        slot_label_normalized: slot.slotLabel,
        is_canonical_slot: boolString(slot.canonical),
        is_variant_title: boolString(/\bUI Kit\b/i.test(title)),
        is_explicit_variant: boolString(/\bVariant\b/i.test(title)),
        width: width == null ? "" : String(width),
        height: height == null ? "" : String(height),
        aspect_ratio: formatAspectRatio(width, height),
        pixel_area: width && height ? String(width * height) : "",
        device_type: screen.deviceType || "",
        has_screenshot: boolString(Boolean(screen.screenshot)),
        screenshot_file_name: parseFileName(screen.screenshot),
        has_html: boolString(Boolean(screen.htmlCode)),
        html_file_name: parseFileName(screen.htmlCode),
        has_figma_export: boolString(Boolean(screen.figmaExport)),
        within_project_slot_count: "0",
        within_project_duplicate: "false",
        within_project_duplicate_rank: "0",
        cross_variant_slot_count: ""
      });
    }
  }

  const projectOrder = projectOrderMap();
  projectRows.sort((a, b) => {
    const pA = projectOrder.get(a.project_id) ?? 999;
    const pB = projectOrder.get(b.project_id) ?? 999;
    if (pA !== pB) return pA - pB;

    const sA = slotSortKey(a.slot_code);
    const sB = slotSortKey(b.slot_code);
    if (sA !== sB) return sA - sB;

    if (a.title_normalized !== b.title_normalized) {
      return a.title_normalized.localeCompare(b.title_normalized);
    }

    return a.screen_id.localeCompare(b.screen_id);
  });

  const slotBuckets = new Map();
  for (const row of projectRows) {
    const key = `${row.project_id}:${row.slot_code}`;
    if (!slotBuckets.has(key)) slotBuckets.set(key, []);
    slotBuckets.get(key).push(row);
  }

  for (const [key, bucket] of slotBuckets.entries()) {
    const slotCode = key.split(":")[1];
    const count = bucket.length;
    for (let i = 0; i < bucket.length; i++) {
      const row = bucket[i];
      row.within_project_slot_count = String(count);
      if (slotCode !== "UNMAPPED" && count > 1) {
        row.within_project_duplicate = "true";
        row.within_project_duplicate_rank = String(i + 1);
      } else if (slotCode !== "UNMAPPED") {
        row.within_project_duplicate = "false";
        row.within_project_duplicate_rank = "1";
      } else {
        row.within_project_duplicate = "false";
        row.within_project_duplicate_rank = "0";
      }
    }
  }

  buildCrossSlotStats(projectRows);

  const projectProfiles = buildProjectProfiles(projectById, projectRows);
  const matrix = buildRepresentativeMatrix(projectRows);
  const generatedAt = new Date().toISOString();

  const markdown = buildMarkdown(projectRows, projectProfiles, matrix, generatedAt);
  const csv = buildCsv(projectRows);

  fs.writeFileSync(OUTPUT_MD, markdown);
  fs.writeFileSync(OUTPUT_CSV, csv);

  console.log(`- wrote: ${OUTPUT_MD}`);
  console.log(`- wrote: ${OUTPUT_CSV}`);
  for (const profile of projectProfiles) {
    console.log(`- ${profile.project_title}: ${profile.total_screens} screens`);
  }
  console.log(`- total: ${projectRows.length} screens`);
}

main().catch((error) => {
  console.error(`[stitch:catalog] ${error.message}`);
  process.exit(1);
});
