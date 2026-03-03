#!/usr/bin/env node

import fs from "node:fs";
import { canonicalId, normalizeTierFromPath, slugify } from "./lib/strings.mjs";
import { nowIso, readJson, writeJson } from "./lib/io.mjs";

const DIRECT_COVERAGE = new Map([
  ["button", "covered"],
  ["text-input", "covered"],
  ["textarea", "covered"],
  ["checkbox", "covered"],
  ["toggle", "covered"],
  ["select", "covered"],
  ["badge", "covered"],
  ["separator", "covered"],
  ["drawer", "covered"],
  ["toast", "covered"],
  ["tabs", "covered"],
  ["card", "covered"],
  ["list", "covered"],
  ["search-input", "covered"],
  ["empty-state", "covered"],
  ["table", "covered"],
  ["modal", "covered"],
  ["navigation", "covered"],
  ["header", "covered"],
  ["hero", "partial"],
  ["footer", "partial"],
  ["spinner", "partial"],
  ["skeleton", "partial"]
]);

const TIER_HINTS = new Map([
  ["accordion", "organism"],
  ["alert", "molecule"],
  ["avatar", "atom"],
  ["badge", "atom"],
  ["breadcrumbs", "molecule"],
  ["button", "atom"],
  ["button-group", "molecule"],
  ["card", "molecule"],
  ["carousel", "organism"],
  ["checkbox", "atom"],
  ["color-picker", "molecule"],
  ["combobox", "molecule"],
  ["date-input", "molecule"],
  ["datepicker", "organism"],
  ["drawer", "organism"],
  ["dropdown-menu", "molecule"],
  ["empty-state", "molecule"],
  ["fieldset", "molecule"],
  ["file", "atom"],
  ["file-upload", "molecule"],
  ["footer", "organism"],
  ["form", "organism"],
  ["header", "organism"],
  ["heading", "atom"],
  ["hero", "organism"],
  ["icon", "atom"],
  ["image", "atom"],
  ["label", "atom"],
  ["link", "atom"],
  ["list", "molecule"],
  ["modal", "organism"],
  ["navigation", "organism"],
  ["pagination", "molecule"],
  ["popover", "molecule"],
  ["progress-bar", "atom"],
  ["progress-indicator", "atom"],
  ["quote", "atom"],
  ["radio-button", "atom"],
  ["rating", "molecule"],
  ["rich-text-editor", "organism"],
  ["search-input", "molecule"],
  ["segmented-control", "molecule"],
  ["select", "atom"],
  ["separator", "atom"],
  ["skeleton", "atom"],
  ["skip-link", "atom"],
  ["slider", "atom"],
  ["spinner", "atom"],
  ["stack", "molecule"],
  ["stepper", "molecule"],
  ["table", "organism"],
  ["tabs", "molecule"],
  ["text-input", "atom"],
  ["textarea", "atom"],
  ["toast", "organism"],
  ["toggle", "atom"],
  ["tooltip", "molecule"],
  ["tree-view", "organism"],
  ["video", "atom"],
  ["visually-hidden", "foundation"]
]);

function readUiExports() {
  const src = fs.readFileSync("packages/ui/src/index.ts", "utf8");
  const entries = [];
  for (const match of src.matchAll(/export \{\s*([A-Za-z0-9_]+)\s*\} from '([^']+)'/g)) {
    const name = match[1];
    const componentPath = match[2];
    entries.push({
      name,
      slug: slugify(name),
      tier: normalizeTierFromPath(componentPath)
    });
  }
  return entries;
}

function inferStatus(componentSlug, uiEntries) {
  if (DIRECT_COVERAGE.has(componentSlug)) {
    return DIRECT_COVERAGE.get(componentSlug);
  }
  const directMatch = uiEntries.find((entry) => entry.slug === componentSlug);
  if (directMatch) return "covered";
  const relaxed = componentSlug.replace(/-/g, "");
  const fuzzy = uiEntries.find((entry) => entry.slug.replace(/-/g, "").includes(relaxed) || relaxed.includes(entry.slug.replace(/-/g, "")));
  return fuzzy ? "partial" : "missing";
}

function buildComponents() {
  const gallery = readJson("docs/design-system/registry/data/component-gallery-components.json");
  const stitchInventory = readJson("docs/design-system/registry/data/stitch-inventory.json");
  const uiEntries = readUiExports();

  const projectIds = stitchInventory.projects.map((p) => p.project_id);
  const slots = ["00", "01", "02", "03", "04", "05"];

  const components = gallery.components.map((component) => {
    const componentSlug = component.slug;
    const status = inferStatus(componentSlug, uiEntries);
    const tier = TIER_HINTS.get(componentSlug) || "atom";
    const relatedUi = uiEntries.filter((entry) => entry.slug.includes(componentSlug) || componentSlug.includes(entry.slug));

    return {
      id: canonicalId(component.name),
      name: component.name,
      atomic_tier: tier,
      status,
      variants: relatedUi.map((entry) => entry.name),
      states: ["default", "hover", "focus-visible", "disabled"],
      accessibility: {
        roles: [],
        keyboard: ["tab", "shift+tab"],
        focus_rules: ["visible-focus-indicator"],
        announcements: []
      },
      token_dependencies: ["semantic.color.*", "semantic.space.*", "semantic.typography.*"],
      stitch_evidence: {
        project_ids: projectIds,
        screen_ids: [],
        slot_codes: slots,
        captured_at: stitchInventory.generated_at
      },
      gallery_evidence: {
        component_name: component.name,
        component_slug: component.slug,
        url: component.url,
        example_count: component.example_count,
        fetched_at: component.fetched_at
      }
    };
  });

  const crosswalk = {
    components: components.map((component) => ({
      component_name: component.name,
      canonical_id: component.id,
      atomic_tier: component.atomic_tier,
      status: component.status,
      gallery_url: component.gallery_evidence.url
    })),
    metadata: {
      generated_at: nowIso(),
      component_count: components.length
    }
  };

  return { components, crosswalk };
}

function buildPatterns() {
  const registry = readJson("docs/pattern-library/registry.json");

  return registry.patterns.map((pattern) => ({
    id: `pattern-${pattern.slot}`,
    name: pattern.title,
    purpose: `Canonical Stitch slot ${pattern.slot} mapped into Praxis pattern library.`,
    composition_graph: {
      nodes: [
        { id: `atom-${pattern.slot}`, tier: "atom" },
        { id: `molecule-${pattern.slot}`, tier: "molecule" },
        { id: `organism-${pattern.slot}`, tier: "organism" },
        { id: `template-${pattern.slot}`, tier: "template" },
        { id: `page-${pattern.slot}`, tier: "page" }
      ],
      edges: [
        { from: `atom-${pattern.slot}`, to: `molecule-${pattern.slot}` },
        { from: `molecule-${pattern.slot}`, to: `organism-${pattern.slot}` },
        { from: `organism-${pattern.slot}`, to: `template-${pattern.slot}` },
        { from: `template-${pattern.slot}`, to: `page-${pattern.slot}` }
      ]
    },
    route_mapping: [pattern.path],
    acceptance_checks: [
      "slot-mapped-in-stitch-catalog",
      "schema-valid",
      "token-backed-spacing"
    ],
    source_components: ["button", "input", "card", "navigation"],
    stitch_slots: [pattern.slot]
  }));
}

function buildProvenance() {
  const generatedAt = nowIso();
  return {
    generated_at: generatedAt,
    sources: [
      {
        id: "component-gallery-components",
        source_url: "https://component.gallery/components/",
        fetched_at: readJson("docs/design-system/registry/data/component-gallery-components.json").metadata.generated_at,
        extractor_version: "v1"
      },
      {
        id: "component-gallery-design-systems",
        source_url: "https://component.gallery/design-systems/",
        fetched_at: readJson("docs/design-system/registry/data/design-systems.json").metadata.generated_at,
        extractor_version: "v1"
      },
      {
        id: "stitch-catalog",
        source_url: "https://project-praxis.local/docs/design-system/stitch/screens-catalog.csv",
        fetched_at: readJson("docs/design-system/registry/data/stitch-inventory.json").generated_at,
        extractor_version: "pnpm-run-stitch-catalog"
      }
    ]
  };
}

function main() {
  const { components, crosswalk } = buildComponents();
  const patterns = buildPatterns();
  const provenance = buildProvenance();

  writeJson("docs/design-system/registry/data/component-definitions.json", {
    metadata: { generated_at: nowIso(), component_count: components.length },
    components
  });

  writeJson("docs/design-system/registry/data/pattern-definitions.json", {
    metadata: { generated_at: nowIso(), pattern_count: patterns.length },
    patterns
  });

  writeJson("docs/design-system/registry/data/component-gallery-crosswalk.json", crosswalk);
  writeJson("docs/design-system/registry/data/provenance.json", provenance);

  console.log(`[ds:build:patterns] components=${components.length} patterns=${patterns.length}`);
}

main();
