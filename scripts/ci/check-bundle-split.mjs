#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = path.join(root, "config", "bundle-guard.json");

if (!fs.existsSync(configPath)) {
  console.error("[bundle-guard] Missing config:", configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const searchRoots = Array.isArray(config.searchRoots) ? config.searchRoots : [];
const plannerEntryRegexes = (config.plannerEntryPatterns || []).map((pattern) => new RegExp(pattern, "i"));
const plannerChunkRegexes = (config.plannerChunkPatterns || []).map((pattern) => new RegExp(pattern, "i"));
const forbiddenRegexes = (config.forbiddenTokens || []).map((token) => new RegExp(token, "i"));

if (forbiddenRegexes.length === 0) {
  console.error("[bundle-guard] No forbidden tokens configured.");
  process.exit(1);
}

const rootsFromArgs = process.argv.slice(2);
const candidateRoots = rootsFromArgs.length > 0 ? rootsFromArgs : searchRoots;

function walkFiles(dirPath, out = []) {
  if (!fs.existsSync(dirPath)) return out;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(entryPath, out);
      continue;
    }
    out.push(entryPath);
  }
  return out;
}

function normalizeToPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function resolveManifestFile(manifestDir, maybeRelativePath) {
  if (!maybeRelativePath || typeof maybeRelativePath !== "string") return null;
  const cleanPath = maybeRelativePath.startsWith("/") ? maybeRelativePath.slice(1) : maybeRelativePath;
  const resolved = path.resolve(manifestDir, cleanPath);
  return fs.existsSync(resolved) ? resolved : null;
}

function addNextAppManifestChunks(manifestPath, plannerChunksSet) {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    console.warn("[bundle-guard] Unable to parse Next app build manifest:", manifestPath, error);
    return;
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return;
  }

  const pages = manifest.pages;
  if (!pages || typeof pages !== "object" || Array.isArray(pages)) {
    return;
  }

  const manifestDir = path.dirname(manifestPath);
  for (const [entryKey, chunks] of Object.entries(pages)) {
    if (!plannerEntryRegexes.some((regex) => regex.test(entryKey))) {
      continue;
    }
    if (!Array.isArray(chunks)) {
      continue;
    }

    for (const chunkPath of chunks) {
      const resolvedChunk = resolveManifestFile(manifestDir, chunkPath);
      if (resolvedChunk) {
        plannerChunksSet.add(resolvedChunk);
      }
    }
  }
}

const existingRoots = candidateRoots
  .map((dir) => path.resolve(root, dir))
  .filter((dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory());

if (existingRoots.length === 0) {
  console.log("[bundle-guard] No build roots found. Skipping.");
  process.exit(0);
}

const jsFiles = [];
for (const dir of existingRoots) {
  for (const filePath of walkFiles(dir)) {
    if (/\.(js|mjs|cjs)$/i.test(filePath)) {
      jsFiles.push(filePath);
    }
  }
}

const plannerChunks = new Set();

for (const filePath of jsFiles) {
  const relativePath = normalizeToPosix(path.relative(root, filePath));
  const fileName = path.basename(relativePath);
  if (plannerChunkRegexes.some((regex) => regex.test(relativePath) || regex.test(fileName))) {
    plannerChunks.add(filePath);
  }
}

const manifestFiles = [];
const nextAppManifestFiles = [];
for (const dir of existingRoots) {
  for (const filePath of walkFiles(dir)) {
    const normalized = normalizeToPosix(filePath);
    if (normalized.endsWith("/manifest.json") || normalized.endsWith("/.vite/manifest.json")) {
      manifestFiles.push(filePath);
      continue;
    }
    if (normalized.endsWith("/app-build-manifest.json")) {
      nextAppManifestFiles.push(filePath);
    }
  }
}

for (const nextManifestPath of nextAppManifestFiles) {
  addNextAppManifestChunks(nextManifestPath, plannerChunks);
}

for (const manifestPath of manifestFiles) {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    console.warn("[bundle-guard] Unable to parse manifest:", manifestPath, error);
    continue;
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    continue;
  }

  const manifestDir = path.dirname(manifestPath);
  const entryByKey = new Map(Object.entries(manifest));
  const fileToKey = new Map();

  for (const [key, value] of entryByKey.entries()) {
    if (value && typeof value.file === "string") {
      fileToKey.set(value.file, key);
    }
  }

  const queue = [];
  const seenKeys = new Set();

  for (const [key, value] of entryByKey.entries()) {
    const keyMatches = plannerEntryRegexes.some((regex) => regex.test(key));
    const srcMatches = value && typeof value.src === "string" && plannerEntryRegexes.some((regex) => regex.test(value.src));
    if (keyMatches || srcMatches) {
      queue.push(key);
    }
  }

  while (queue.length > 0) {
    const key = queue.shift();
    if (!key || seenKeys.has(key)) continue;
    seenKeys.add(key);

    const item = entryByKey.get(key);
    if (!item || typeof item !== "object") continue;

    const resolvedMain = resolveManifestFile(manifestDir, item.file);
    if (resolvedMain) plannerChunks.add(resolvedMain);

    const deps = [...(item.imports || []), ...(item.dynamicImports || [])];
    for (const depFile of deps) {
      const depKey = fileToKey.get(depFile);
      if (depKey && !seenKeys.has(depKey)) {
        queue.push(depKey);
      }
      const resolvedDep = resolveManifestFile(manifestDir, depFile);
      if (resolvedDep) plannerChunks.add(resolvedDep);
    }
  }
}

if (plannerChunks.size === 0) {
  console.log("[bundle-guard] No planner chunks found. Skipping.");
  process.exit(0);
}

const violations = [];

for (const filePath of plannerChunks) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, "utf8");
  const matchedTokens = forbiddenRegexes
    .filter((regex) => regex.test(content))
    .map((regex) => regex.source.replace(/\\/g, ""));

  if (matchedTokens.length > 0) {
    violations.push({
      file: normalizeToPosix(path.relative(root, filePath)),
      tokens: matchedTokens
    });
  }
}

if (violations.length > 0) {
  console.error("[bundle-guard] Forbidden modules leaked into planner chunks:");
  for (const violation of violations) {
    console.error(` - ${violation.file}: ${violation.tokens.join(", ")}`);
  }
  process.exit(1);
}

console.log(`[bundle-guard] Checked ${plannerChunks.size} planner chunks: OK`);
