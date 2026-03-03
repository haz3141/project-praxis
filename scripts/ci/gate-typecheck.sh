#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_npm_script typecheck check-types types; then
  ci_log "Typecheck gate passed."
  exit 0
fi

ci_skip "No typecheck script found."
