#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_pnpm_script lint lint:md; then
  if package_script_exists lint:ds; then
    ci_log "Running DS lint guards."
    pnpm run lint:ds
  fi
  if package_script_exists lint:architecture; then
    ci_log "Running architecture boundary guards."
    pnpm run lint:architecture
  fi
  ci_log "Lint gate passed."
  exit 0
fi

ci_skip "No lint script found."
