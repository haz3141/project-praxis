#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targetDir = path.join(root, 'packages', 'ui', 'src', 'components');
const includeExt = new Set(['.ts', '.tsx']);

const patterns = [
  { name: 'hex', regex: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb', regex: /\brgba?\s*\(/gi },
  { name: 'hsl', regex: /\bhsla?\s*\(/gi },
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
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

const files = walk(targetDir);
const findings = [];
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern.regex)) {
      findings.push({
        file: path.relative(root, file),
        line: lineAt(content, match.index ?? 0),
        type: pattern.name,
        value: match[0],
      });
    }
  }
}

if (findings.length > 0) {
  console.error('[ds-color-guard] Hardcoded color literals found in UI components:');
  for (const finding of findings) {
    console.error(` - ${finding.file}:${finding.line} (${finding.type}) ${finding.value}`);
  }
  process.exit(1);
}

console.log(`[ds-color-guard] Checked ${files.length} files: OK`);
