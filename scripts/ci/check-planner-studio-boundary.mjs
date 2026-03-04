#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const appRoot = path.join(root, "apps", "planner", "app");

function collectRouteFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectRouteFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))) {
      files.push(fullPath);
    }
  }
  return files;
}

const routeFiles = collectRouteFiles(appRoot);

const isStudioRoute = (relativePath) =>
  relativePath.startsWith("studio/") || relativePath.startsWith("api/studio/");

const blockedImportPatterns = [
  { regex: /@\/components\/studio\//g, label: "@/components/studio/*" },
  { regex: /@\/src\/features\/studio\//g, label: "@/src/features/studio/*" },
  { regex: /@excalidraw\/excalidraw/g, label: "@excalidraw/excalidraw" }
];

const violations = [];

for (const filePath of routeFiles) {
  const relativePath = path.relative(appRoot, filePath).replace(/\\/g, "/");
  if (isStudioRoute(relativePath)) continue;

  const source = readFileSync(filePath, "utf8");
  for (const blocked of blockedImportPatterns) {
    if (blocked.regex.test(source)) {
      violations.push({
        filePath,
        relativePath,
        importLabel: blocked.label
      });
    }
  }
}

if (violations.length > 0) {
  console.error("[planner-studio-boundary] Studio-only imports leaked into non-studio planner routes:");
  for (const violation of violations) {
    console.error(` - ${violation.relativePath}: contains '${violation.importLabel}'`);
  }
  process.exit(1);
}

console.log(`[planner-studio-boundary] OK: checked ${routeFiles.length} route files.`);
