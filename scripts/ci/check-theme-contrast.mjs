#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tokensPath = path.join(root, "packages", "design-tokens", "dist", "tokens.resolved.json");

const checks = [
  {
    id: "body-on-canvas",
    foreground: "color.fg.default",
    background: "color.bg.canvas",
    minRatio: 4.5
  },
  {
    id: "body-on-surface",
    foreground: "color.fg.default",
    background: "color.bg.surface",
    minRatio: 4.5
  },
  {
    id: "muted-on-planner-surface",
    foreground: "color.planner.textMuted",
    background: "color.planner.surface",
    minRatio: 4.5
  },
  {
    id: "interactive-label",
    foreground: "color.fg.onInteractive",
    background: "color.bg.interactive",
    minRatio: 4.5
  },
  {
    id: "focus-on-surface",
    foreground: "color.border.focus",
    background: "color.bg.surface",
    minRatio: 3
  }
];

function fail(message) {
  console.error(`[ds-contrast] ${message}`);
  process.exit(1);
}

function parseColor(input) {
  if (typeof input !== "string") {
    return null;
  }

  const value = input.trim().toLowerCase();
  if (value.startsWith("#")) {
    let hex = value.slice(1);
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}ff`;
    } else if (hex.length === 4) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    } else if (hex.length === 6) {
      hex = `${hex}ff`;
    }

    if (hex.length !== 8) {
      return null;
    }

    const number = Number.parseInt(hex, 16);
    return {
      r: (number >> 24) & 255,
      g: (number >> 16) & 255,
      b: (number >> 8) & 255,
      a: (number & 255) / 255
    };
  }

  const rgbaMatch = value.match(/^rgba?\(([^)]+)\)$/);
  if (!rgbaMatch) {
    return null;
  }

  const parts = rgbaMatch[1].split(",").map((part) => part.trim());
  if (parts.length < 3) {
    return null;
  }

  const [r, g, b] = parts.slice(0, 3).map((part) => Number(part));
  const a = parts[3] === undefined ? 1 : Number(parts[3]);
  if (![r, g, b, a].every((part) => Number.isFinite(part))) {
    return null;
  }

  return { r, g, b, a };
}

function blend(top, bottom) {
  const alpha = top.a + bottom.a * (1 - top.a);
  if (alpha === 0) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  return {
    r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / alpha,
    g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / alpha,
    b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / alpha,
    a: alpha
  };
}

function srgbToLinear(value) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(color) {
  return (
    0.2126 * srgbToLinear(color.r) +
    0.7152 * srgbToLinear(color.g) +
    0.0722 * srgbToLinear(color.b)
  );
}

function contrastRatio(first, second) {
  const l1 = luminance(first);
  const l2 = luminance(second);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

function withOpaqueBackground(foreground, background) {
  const white = { r: 255, g: 255, b: 255, a: 1 };
  const opaqueBackground = background.a < 1 ? blend(background, white) : background;
  return {
    foreground: foreground.a < 1 ? blend(foreground, opaqueBackground) : foreground,
    background: opaqueBackground
  };
}

if (!fs.existsSync(tokensPath)) {
  fail("tokens.resolved.json is missing. Run `pnpm --filter @praxis/design-tokens build` first.");
}

const resolved = JSON.parse(fs.readFileSync(tokensPath, "utf8"));
const failures = [];
let checksRun = 0;

for (const [theme, densityMap] of Object.entries(resolved)) {
  for (const [density, values] of Object.entries(densityMap)) {
    for (const check of checks) {
      checksRun += 1;
      const foregroundRaw = values[check.foreground];
      const backgroundRaw = values[check.background];
      const foreground = parseColor(foregroundRaw);
      const background = parseColor(backgroundRaw);

      if (!foreground || !background) {
        failures.push(
          `${theme}/${density} ${check.id}: unable to parse colors (${check.foreground}=${foregroundRaw}, ${check.background}=${backgroundRaw})`
        );
        continue;
      }

      const pair = withOpaqueBackground(foreground, background);
      const ratio = contrastRatio(pair.foreground, pair.background);
      if (ratio < check.minRatio) {
        failures.push(
          `${theme}/${density} ${check.id}: ${ratio.toFixed(2)} < ${check.minRatio.toFixed(1)} (${check.foreground} on ${check.background})`
        );
      }
    }
  }
}

if (failures.length > 0) {
  console.error("[ds-contrast] Contrast checks failed:");
  for (const failure of failures) {
    console.error(` - ${failure}`);
  }
  process.exit(1);
}

console.log(`[ds-contrast] ${checksRun} checks passed across all theme/density variants.`);
