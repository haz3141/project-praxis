# Praxis Design-System Registry

This directory contains the machine-readable registry scaffold used by agent workflows and future productization.

## Commands

- `pnpm ds:sync:gallery`: crawl live Component Gallery components and design systems.
- `pnpm ds:sync:stitch`: refresh Stitch catalog and inventory for the four Praxis UI Kit projects.
- `pnpm ds:build:patterns`: build component definitions, crosswalk, pattern graph, and provenance.
- `pnpm ds:validate`: validate generated artifacts against local JSON Schemas.
- `pnpm ds:audit`: run the full sequence and emit audit/drift/backlog reports.

## Data Outputs

- `data/component-gallery-components.json`
- `data/design-systems.json`
- `data/stitch-inventory.json`
- `data/component-definitions.json`
- `data/component-gallery-crosswalk.json`
- `data/pattern-definitions.json`
- `data/provenance.json`

## Schemas

- `schemas/component-definition.schema.json`
- `schemas/pattern-definition.schema.json`
- `schemas/design-system-registry.schema.json`
- `schemas/provenance.schema.json`
- `schemas/crosswalk.schema.json`
- `schemas/stitch-inventory.schema.json`

## Reports

- `reports/audit-2026-03-03.md`
- `reports/drift-report-2026-03-03.md`
- `reports/remediation-backlog-2026-03-03.md`
