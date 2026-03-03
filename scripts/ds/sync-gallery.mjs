#!/usr/bin/env node

import { canonicalId, slugify } from "./lib/strings.mjs";
import { checksum, nowIso, writeJson } from "./lib/io.mjs";

const EXTRACTOR_VERSION = "v1";
const COMPONENTS_URL = "https://component.gallery/components/";
const SYSTEMS_URL = "https://component.gallery/design-systems/";

function extractListItems(html) {
  return html.match(/<li class="link-card[\s\S]*?<\/li>/g) || [];
}

function stripTags(input) {
  return String(input).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function parseAttrs(openTag) {
  const attrs = {};
  for (const m of openTag.matchAll(/\s([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g)) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function parseComponents(html, fetchedAt) {
  const items = extractListItems(html);
  return items
    .map((item) => {
      const openTag = item.match(/^<li\s+([^>]+)>/)?.[0] || "";
      const attrs = parseAttrs(openTag);
      const name = attrs["data-name"] || "";
      if (!name) return null;
      const exampleCount = Number(attrs["data-example-count"] || 0);
      const href = item.match(/<a href="([^"]+)" class="primary-link"/)?.[1] || `/components/${slugify(name)}`;
      const desc = stripTags(item.match(/<div class="body-text[\s\S]*?<\/div>/)?.[0] || "");
      return {
        id: canonicalId(name),
        name,
        slug: slugify(name),
        url: new URL(href, COMPONENTS_URL).toString(),
        example_count: Number.isFinite(exampleCount) ? exampleCount : 0,
        description: desc,
        fetched_at: fetchedAt
      };
    })
    .filter(Boolean);
}

function splitTags(raw) {
  const value = String(raw || "").trim();
  if (!value || value === "false") return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

function parseSystems(html, fetchedAt) {
  const items = extractListItems(html);
  return items
    .map((item) => {
      const openTag = item.match(/^<li\s+([^>]+)>/)?.[0] || "";
      const attrs = parseAttrs(openTag);
      const name = attrs["data-name"] || "";
      if (!name) return null;
      const href = item.match(/<a href="([^"]+)" class="primary-link"/)?.[1] || "";
      return {
        id: `ds-${slugify(name)}`,
        name,
        homepage: href,
        component_count: Number(attrs["data-component-count"] || 0),
        platform_tags: splitTags(attrs["data-platforms"]),
        tech_tags: splitTags(attrs["data-tech"]),
        feature_tags: splitTags(attrs["data-features"]),
        provenance: {
          source_url: SYSTEMS_URL,
          fetched_at: fetchedAt,
          extractor_version: EXTRACTOR_VERSION
        }
      };
    })
    .filter((x) => x && x.homepage.startsWith("http"));
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "project-praxis-ds-sync/1.0"
    }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.text();
}

async function main() {
  const fetchedAt = nowIso();
  const [componentsHtml, systemsHtml] = await Promise.all([
    fetchText(COMPONENTS_URL),
    fetchText(SYSTEMS_URL)
  ]);

  const components = parseComponents(componentsHtml, fetchedAt).sort((a, b) => a.name.localeCompare(b.name));
  const systems = parseSystems(systemsHtml, fetchedAt).sort((a, b) => a.name.localeCompare(b.name));

  if (components.length === 0) {
    throw new Error("Component Gallery component list is empty.");
  }

  const componentsPayload = {
    metadata: {
      generated_at: fetchedAt,
      source_url: COMPONENTS_URL,
      extractor_version: EXTRACTOR_VERSION,
      checksum: checksum(JSON.stringify(components))
    },
    components
  };

  const systemsPayload = {
    metadata: {
      generated_at: fetchedAt,
      source_url: SYSTEMS_URL,
      extractor_version: EXTRACTOR_VERSION,
      checksum: checksum(JSON.stringify(systems))
    },
    systems
  };

  writeJson("docs/design-system/registry/data/component-gallery-components.json", componentsPayload);
  writeJson("docs/design-system/registry/data/design-systems.json", systemsPayload);

  console.log(`[ds:sync:gallery] components=${components.length} systems=${systems.length}`);
}

main().catch((error) => {
  console.error(`[ds:sync:gallery] ${error.message}`);
  process.exit(1);
});
