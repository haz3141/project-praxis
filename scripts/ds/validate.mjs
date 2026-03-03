#!/usr/bin/env node

import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readJson } from "./lib/io.mjs";

const SCHEMAS_DIR = "docs/design-system/registry/schemas";

function loadSchema(name) {
  return readJson(path.join(SCHEMAS_DIR, name));
}

function fail(message, detail) {
  console.error(`[ds:validate] ${message}`);
  if (detail) console.error(detail);
  process.exit(1);
}

function validateData(validator, data, label) {
  const ok = validator(data);
  if (!ok) {
    fail(`schema validation failed for ${label}`, JSON.stringify(validator.errors, null, 2));
  }
}

function main() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  const provenanceSchema = loadSchema("provenance.schema.json");
  const componentSchema = loadSchema("component-definition.schema.json");
  const patternSchema = loadSchema("pattern-definition.schema.json");
  const crosswalkSchema = loadSchema("crosswalk.schema.json");
  const stitchSchema = loadSchema("stitch-inventory.schema.json");
  const designSystemsSchema = loadSchema("design-system-registry.schema.json");

  ajv.addSchema(provenanceSchema, provenanceSchema.$id);
  ajv.addSchema(provenanceSchema, "./provenance.schema.json");

  const validateComponent = ajv.compile(componentSchema);
  const validatePattern = ajv.compile(patternSchema);
  const validateCrosswalk = ajv.compile(crosswalkSchema);
  const validateStitch = ajv.compile(stitchSchema);
  const validateDesignSystems = ajv.compile(designSystemsSchema);

  const componentDefs = readJson("docs/design-system/registry/data/component-definitions.json");
  const patternDefs = readJson("docs/design-system/registry/data/pattern-definitions.json");
  const crosswalk = readJson("docs/design-system/registry/data/component-gallery-crosswalk.json");
  const stitchInventory = readJson("docs/design-system/registry/data/stitch-inventory.json");
  const designSystems = readJson("docs/design-system/registry/data/design-systems.json");
  const provenance = readJson("docs/design-system/registry/data/provenance.json");

  for (const component of componentDefs.components) {
    validateData(validateComponent, component, `component ${component.id}`);
  }
  for (const pattern of patternDefs.patterns) {
    validateData(validatePattern, pattern, `pattern ${pattern.id}`);
  }

  validateData(validateCrosswalk, crosswalk, "component-gallery-crosswalk.json");
  validateData(validateStitch, stitchInventory, "stitch-inventory.json");
  validateData(validateDesignSystems, designSystems, "design-systems.json");

  if (!Array.isArray(provenance.sources) || provenance.sources.length === 0) {
    fail("provenance.json missing sources");
  }

  const provValidator = ajv.compile(provenanceSchema);
  for (const source of provenance.sources) {
    validateData(provValidator, source, `provenance ${source.id || "unknown"}`);
  }

  console.log("[ds:validate] all registry artifacts are schema-valid.");
}

main();
