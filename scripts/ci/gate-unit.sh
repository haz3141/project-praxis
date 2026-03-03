#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_pnpm_script test:unit unit test; then
  ci_log "Unit gate passed."
  exit 0
fi

ci_skip "No unit test script found."
