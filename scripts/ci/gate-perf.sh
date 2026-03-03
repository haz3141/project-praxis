#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if npm_script_exists build; then
  ci_log "Running build before perf guard."
  npm run build
else
  ci_log "No build script found. Checking existing build outputs only."
fi

node scripts/ci/check-bundle-split.mjs
ci_log "Perf gate passed."
