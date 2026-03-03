#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib.sh"

if run_first_npm_script test:e2e e2e; then
  ci_log "E2E gate passed via npm script."
  exit 0
fi

if [[ -z "${CI_WEB_SERVER_COMMAND:-}" ]]; then
  if ci_command="$(pick_default_web_server_command)"; then
    export CI_WEB_SERVER_COMMAND="$ci_command"
    ci_log "Using inferred web server command: $CI_WEB_SERVER_COMMAND"
  fi
fi

if ! npx playwright --version >/dev/null 2>&1; then
  ci_skip "Playwright is unavailable and no e2e npm script is defined."
fi

if [[ -z "${CI_WEB_SERVER_COMMAND:-}" ]]; then
  ci_skip "No web server command available for Playwright."
fi

npx playwright test tests/e2e/smoke.capture-today-complete-review.spec.ts --project=chromium
ci_log "E2E gate passed via Playwright smoke test."
