#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const requiredDocs = [
  "docs/design-system/stitch/audit.md",
  "docs/design-system/stitch/README.md"
];

const stitchUrl = process.env.STITCH_MCP_URL || "https://stitch.googleapis.com/mcp";
const hasApiKeyEnv = Boolean(process.env.STITCH_API_KEY);
const hasOauthEnv = Boolean(process.env.STITCH_OAUTH_ACCESS_TOKEN);

const home = os.homedir();
const codexConfigPath = path.join(home, ".codex", "config.toml");
const geminiConfigPath = path.join(home, ".gemini", "antigravity", "mcp_config.json");

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function detectCodexConfigMode() {
  const raw = readFileSafe(codexConfigPath);
  if (!raw) return { present: false, mode: null, valid: false };

  const lines = raw.split(/\r?\n/);
  let inStitchSection = false;
  let sawStitchSection = false;
  const stitchLines = [];

  for (const line of lines) {
    const sectionMatch = line.match(/^\s*\[([^\]]+)\]\s*$/);
    if (sectionMatch) {
      const sectionName = sectionMatch[1].trim();
      inStitchSection = sectionName === "mcp_servers.stitch" || sectionName.startsWith("mcp_servers.stitch.");
      if (inStitchSection) sawStitchSection = true;
    }

    if (inStitchSection) stitchLines.push(line);
  }

  if (!sawStitchSection) return { present: false, mode: null, valid: false };

  const stitchRaw = stitchLines.join("\n");
  const hasApiHeader = /\bX-Goog-Api-Key\b/.test(stitchRaw);
  const hasAuthHeader = /\bAuthorization\b/.test(stitchRaw);

  if (hasApiHeader && hasAuthHeader) return { present: true, mode: "mixed", valid: true };
  if (hasApiHeader) return { present: true, mode: "api_key", valid: true };
  if (hasAuthHeader) return { present: true, mode: "oauth", valid: true };
  return { present: true, mode: "unknown", valid: false };
}

function detectGeminiConfigMode() {
  const raw = readFileSafe(geminiConfigPath);
  if (!raw) return { present: false, mode: null, valid: false };

  try {
    const parsed = JSON.parse(raw);
    const stitch = parsed?.mcpServers?.stitch;
    if (!stitch) return { present: false, mode: null, valid: false };
    const headers = stitch?.headers || {};

    const hasApiHeader = Object.prototype.hasOwnProperty.call(headers, "X-Goog-Api-Key");
    const hasAuthHeader = Object.prototype.hasOwnProperty.call(headers, "Authorization");

    if (hasApiHeader && hasAuthHeader) return { present: true, mode: "mixed", valid: true };
    if (hasApiHeader) return { present: true, mode: "api_key", valid: true };
    if (hasAuthHeader) return { present: true, mode: "oauth", valid: true };
    return { present: true, mode: "unknown", valid: false };
  } catch {
    return { present: true, mode: "invalid_json", valid: false };
  }
}

function validateDocs() {
  const missing = requiredDocs.filter((doc) => !fs.existsSync(doc));
  return { ok: missing.length === 0, missing };
}

function printStatus(label, ok, detail = "") {
  const marker = ok ? "[ok]" : "[error]";
  console.log(`${marker} ${label}${detail ? `: ${detail}` : ""}`);
}

const docState = validateDocs();
const codexMode = detectCodexConfigMode();
const geminiMode = detectGeminiConfigMode();

let authMode = "none";
if (hasApiKeyEnv && hasOauthEnv) authMode = "mixed";
else if (hasApiKeyEnv) authMode = "api_key";
else if (hasOauthEnv) authMode = "oauth";

const hasEnvAuth = authMode !== "none";
const hasLocalClientConfig = Boolean(codexMode.valid || geminiMode.valid);

console.log("Stitch configuration validation");
console.log(`- expected_mcp_url: ${stitchUrl}`);
console.log(`- env_auth_mode: ${authMode}`);
console.log(`- codex_config: ${codexMode.present ? codexMode.mode : "absent"}`);
console.log(`- gemini_config: ${geminiMode.present ? geminiMode.mode : "absent"}`);

if (hasApiKeyEnv && hasOauthEnv) {
  console.log("[warn] Both STITCH_API_KEY and STITCH_OAUTH_ACCESS_TOKEN are set; prefer one mode per session.");
}
if (codexMode.present && !codexMode.valid) {
  console.log("[warn] Codex Stitch MCP config is present but missing auth headers in the Stitch section.");
}
if (geminiMode.mode === "invalid_json") {
  console.log("[warn] Gemini Stitch MCP config file is malformed JSON.");
} else if (geminiMode.present && !geminiMode.valid) {
  console.log("[warn] Gemini Stitch MCP config is present but missing auth headers in the Stitch section.");
}
if (!hasEnvAuth && hasLocalClientConfig) {
  console.log("[warn] No Stitch auth env vars are set; relying on local MCP client config.");
}

printStatus("Required docs present", docState.ok, docState.ok ? "audit + stitch README found" : `missing ${docState.missing.join(", ")}`);

if (!hasEnvAuth && !hasLocalClientConfig) {
  printStatus(
    "Stitch auth configuration",
    false,
    "set STITCH_API_KEY or STITCH_OAUTH_ACCESS_TOKEN, or configure a local MCP client with Stitch"
  );
  process.exit(1);
}

printStatus("Stitch auth configuration", true, hasEnvAuth ? "env vars detected" : "local MCP client config detected");
console.log("[ok] Validation complete (no network calls made).\n");
