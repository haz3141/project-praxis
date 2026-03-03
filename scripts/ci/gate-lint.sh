#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_pnpm_script lint lint:md; then
  ci_log "Lint gate passed."
  exit 0
fi

ci_skip "No lint script found."
