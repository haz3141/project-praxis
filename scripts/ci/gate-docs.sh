#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_pnpm_script validate; then
  ci_log "Docs governance gate passed."
  exit 0
fi

ci_skip "No docs governance script found."
