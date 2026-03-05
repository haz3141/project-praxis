const fs = require('fs');
const path = require('path');

const packageRoot = path.resolve(__dirname, '..');
const tokensDir = path.join(packageRoot, 'src', 'tokens');
const distDir = path.join(packageRoot, 'dist');

const themeModes = ['light', 'dark', 'liquid-neon'];
const densityModes = ['comfortable', 'compact'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, source) {
  if (!isObject(source)) {
    return target;
  }

  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    if (isObject(sourceValue) && isObject(targetValue) && !('$value' in sourceValue)) {
      deepMerge(targetValue, sourceValue);
      continue;
    }

    if (isObject(sourceValue)) {
      target[key] = { ...(isObject(targetValue) ? targetValue : {}), ...sourceValue };
      continue;
    }

    target[key] = sourceValue;
  }

  return target;
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getByPath(obj, pathParts) {
  return pathParts.reduce((acc, part) => {
    if (!isObject(acc)) {
      return undefined;
    }
    return acc[part];
  }, obj);
}

function resolveValue(rawValue, rootContext, stack) {
  if (typeof rawValue !== 'string') {
    return String(rawValue);
  }

  const referenceMatch = rawValue.match(/^\{(.+)\}$/);
  if (!referenceMatch) {
    return rawValue;
  }

  const referencePath = referenceMatch[1];
  if (stack.includes(referencePath)) {
    throw new Error(`Circular token reference detected: ${stack.join(' -> ')} -> ${referencePath}`);
  }

  const refTarget = getByPath(rootContext, referencePath.split('.'));
  if (refTarget === undefined) {
    throw new Error(`Unresolved token reference: ${referencePath}`);
  }

  if (isObject(refTarget) && '$value' in refTarget) {
    return resolveValue(refTarget.$value, rootContext, [...stack, referencePath]);
  }

  if (typeof refTarget === 'string') {
    return resolveValue(refTarget, rootContext, [...stack, referencePath]);
  }

  return String(refTarget);
}

function collectSemanticTokens(node, pathParts, rootContext, output) {
  if (!isObject(node)) {
    return;
  }

  if ('$value' in node) {
    output[pathParts.join('.')] = resolveValue(node.$value, rootContext, []);
    return;
  }

  for (const [key, child] of Object.entries(node)) {
    collectSemanticTokens(child, [...pathParts, key], rootContext, output);
  }
}

function toCssVarName(tokenPath) {
  const kebabPath = tokenPath
    .split('.')
    .map((segment) => segment.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');
  return `--ds-${kebabPath}`;
}

function declarationsToBlock(declarations) {
  return Object.entries(declarations)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([tokenPath, value]) => `  ${toCssVarName(tokenPath)}: ${value};`)
    .join('\n');
}

function buildVariant(theme, density, primitives, semanticBase) {
  const themeOverride = readJson(path.join(tokensDir, 'modes', `theme.${theme}.json`));
  const densityOverride = readJson(path.join(tokensDir, 'modes', `density.${density}.json`));

  const semantic = deepMerge(deepMerge(deepClone(semanticBase), themeOverride), densityOverride);
  const rootContext = { primitives, semantic };

  const declarations = {};
  collectSemanticTokens(semantic, [], rootContext, declarations);
  return declarations;
}

function build() {
  const primitivesFile = readJson(path.join(tokensDir, 'primitives.json'));
  const primitives = primitivesFile.primitives || primitivesFile;
  const semanticBase = readJson(path.join(tokensDir, 'semantic.json'));
  const modes = {
    theme: {
      light: readJson(path.join(tokensDir, 'modes', 'theme.light.json')),
      dark: readJson(path.join(tokensDir, 'modes', 'theme.dark.json')),
      'liquid-neon': readJson(path.join(tokensDir, 'modes', 'theme.liquid-neon.json')),
    },
    density: {
      comfortable: readJson(path.join(tokensDir, 'modes', 'density.comfortable.json')),
      compact: readJson(path.join(tokensDir, 'modes', 'density.compact.json')),
    },
  };

  fs.mkdirSync(distDir, { recursive: true });

  const resolved = {};
  for (const theme of themeModes) {
    resolved[theme] = {};
    for (const density of densityModes) {
      resolved[theme][density] = buildVariant(theme, density, primitives, semanticBase);
    }
  }

  const blocks = [];
  const defaultDeclarations = resolved.light.comfortable;
  blocks.push(`:root,\n[data-theme="light"][data-density="comfortable"] {\n${declarationsToBlock(defaultDeclarations)}\n}`);

  for (const theme of themeModes) {
    for (const density of densityModes) {
      if (theme === 'light' && density === 'comfortable') {
        continue;
      }
      const selector = `[data-theme="${theme}"][data-density="${density}"]`;
      const declarationBlock = declarationsToBlock(resolved[theme][density]);
      blocks.push(`${selector} {\n${declarationBlock}\n}`);
    }
  }

  const banner = '/* Generated from DTCG-aligned semantic tokens. Do not edit directly. */';
  fs.writeFileSync(path.join(distDir, 'tokens.css'), `${banner}\n\n${blocks.join('\n\n')}\n`);
  fs.writeFileSync(path.join(distDir, 'tokens.resolved.json'), `${JSON.stringify(resolved, null, 2)}\n`);
  fs.writeFileSync(
    path.join(distDir, 'tokens.json'),
    `${JSON.stringify({ primitives, semantic: semanticBase, modes }, null, 2)}\n`,
  );
}

build();
