#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targetFile = path.join(root, 'packages', 'ui', 'src', 'styles.css');
const declarationRegex =
  /padding(?:-(?:top|right|bottom|left|inline|inline-start|inline-end|block|block-start|block-end))?\s*:\s*([^;]+);/gim;
const literalUnitRegex = /-?\d+(?:\.\d+)?(?:px|rem|em)\b/i;

function lineAt(content, index) {
  return content.slice(0, index).split('\n').length;
}

if (!fs.existsSync(targetFile)) {
  console.log('[ds-padding-guard] styles.css not found, skipping.');
  process.exit(0);
}

const source = fs.readFileSync(targetFile, 'utf8');
const findings = [];

for (const match of source.matchAll(declarationRegex)) {
  const declarationValue = (match[1] ?? '').trim();
  const usesTokenVar = /var\(--ds-/.test(declarationValue);
  const usesLiteralUnit = literalUnitRegex.test(declarationValue);

  if (!usesTokenVar || usesLiteralUnit) {
    findings.push({
      line: lineAt(source, match.index ?? 0),
      value: declarationValue.replace(/\s+/g, ' '),
    });
  }
}

if (findings.length > 0) {
  console.error('[ds-padding-guard] Non-token or literal-unit padding declarations found:');
  for (const finding of findings) {
    console.error(` - packages/ui/src/styles.css:${finding.line} ${finding.value}`);
  }
  process.exit(1);
}

console.log(`[ds-padding-guard] Checked padding declarations in ${path.relative(root, targetFile)}: OK`);
