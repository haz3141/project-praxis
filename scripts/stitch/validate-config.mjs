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
  if (!raw) return { present: false, mode: null };

  const hasStitchServer = /\[mcp_servers\.stitch\]/.test(raw);
  if (!hasStitchServer) return { present: false, mode: null };

  const hasApiHeader = /X-Goog-Api-Key\s*=/.test(raw);
  const hasAuthHeader = /Authorization\s*=/.test(raw);

  if (hasApiHeader && hasAuthHeader) return { present: true, mode: "mixed" };
  if (hasApiHeader) return { present: true, mode: "api_key" };
  if (hasAuthHeader) return { present: true, mode: "oauth" };
  return { present: true, mode: "unknown" };
}

function detectGeminiConfigMode() {
  const raw = readFileSafe(geminiConfigPath);
  if (!raw) return { present: false, mode: null };

  try {
    const parsed = JSON.parse(raw);
    const stitch = parsed?.mcpServers?.stitch;
    if (!stitch) return { present: false, mode: null };
    const headers = stitch?.headers || {};

    const hasApiHeader = Object.prototype.hasOwnProperty.call(headers, "X-Goog-Api-Key");
    const hasAuthHeader = Object.prototype.hasOwnProperty.call(headers, "Authorization");

    if (hasApiHeader && hasAuthHeader) return { present: true, mode: "mixed" };
    if (hasApiHeader) return { present: true, mode: "api_key" };
    if (hasAuthHeader) return { present: true, mode: "oauth" };
    return { present: true, mode: "unknown" };
  } catch {
    return { present: true, mode: "unknown" };
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
const hasLocalClientConfig = codexMode.present || geminiMode.present;

console.log("Stitch configuration validation");
console.log(`- expected_mcp_url: ${stitchUrl}`);
console.log(`- env_auth_mode: ${authMode}`);
console.log(`- codex_config: ${codexMode.present ? codexMode.mode : "absent"}`);
console.log(`- gemini_config: ${geminiMode.present ? geminiMode.mode : "absent"}`);

if (hasApiKeyEnv && hasOauthEnv) {
  console.log("[warn] Both STITCH_API_KEY and STITCH_OAUTH_ACCESS_TOKEN are set; prefer one mode per session.");
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
