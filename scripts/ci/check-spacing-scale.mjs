#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  path.join(root, 'packages', 'ui', 'src', 'components'),
  path.join(root, 'packages', 'ui', 'src', 'styles.css'),
];

const includeExt = new Set(['.ts', '.tsx', '.css']);
const allowedPx = new Set([0, 1, 2, 4, 8, 12, 16, 20, 24, 32, 40, 56, 64, 72, 96, 260, 320, 999]);
const pxRegex = /(-?\d+(?:\.\d+)?)px\b/g;

function collectFiles(inputPath, out = []) {
  if (!fs.existsSync(inputPath)) {
    return out;
  }

  const stat = fs.statSync(inputPath);
  if (stat.isFile()) {
    if (includeExt.has(path.extname(inputPath))) {
      out.push(inputPath);
    }
    return out;
  }

  for (const entry of fs.readdirSync(inputPath, { withFileTypes: true })) {
    const full = path.join(inputPath, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
      continue;
    }
    if (includeExt.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function lineAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

const files = targets.flatMap((target) => collectFiles(target));
const findings = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(pxRegex)) {
    const raw = Number.parseFloat(match[1] ?? '0');
    if (!Number.isFinite(raw)) {
      continue;
    }
    if (allowedPx.has(raw)) {
      continue;
    }
    findings.push({
      file: path.relative(root, file),
      line: lineAt(content, match.index ?? 0),
      value: match[0],
    });
  }
}

if (findings.length > 0) {
  console.error('[ds-spacing-guard] Non-scale pixel values found:');
  for (const finding of findings) {
    console.error(` - ${finding.file}:${finding.line} ${finding.value}`);
  }
  process.exit(1);
}

console.log(`[ds-spacing-guard] Checked ${files.length} files: OK`);
