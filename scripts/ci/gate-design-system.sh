#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

ci_log "Running Stitch configuration validation."
pnpm run stitch:validate

if [[ -z "${STITCH_API_KEY:-}" && -z "${STITCH_OAUTH_ACCESS_TOKEN:-}" ]]; then
  ci_log "ERROR: strict design-system gate requires STITCH_API_KEY or STITCH_OAUTH_ACCESS_TOKEN."
  exit 1
fi

ci_log "Refreshing Stitch catalog and derived registry artifacts."
pnpm run stitch:catalog
pnpm run ds:sync:stitch
pnpm run ds:build:patterns
pnpm run ds:validate

ci_log "Building design tokens for variant sync."
pnpm --filter @praxis/design-tokens build

ci_log "Checking for unstaged drift in generated DS artifacts."
if ! git diff --quiet -- \
  docs/design-system/stitch/screens-catalog.md \
  docs/design-system/stitch/screens-catalog.csv \
  docs/design-system/stitch/exports.md \
  docs/design-system/registry/data/stitch-inventory.json \
  docs/design-system/registry/data/component-definitions.json \
  docs/design-system/registry/data/pattern-definitions.json \
  docs/design-system/registry/data/component-gallery-crosswalk.json \
  docs/design-system/registry/data/provenance.json; then
  ci_log "ERROR: design-system artifacts are out of sync."
  ci_log "Run: pnpm run stitch:catalog && pnpm run ds:sync:stitch && pnpm run ds:build:patterns && pnpm run ds:validate"
  exit 1
fi

ci_log "Design-system gate passed."
