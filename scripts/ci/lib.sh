#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$ROOT_DIR"

ci_log() {
  echo "[ci] $*"
}

ci_skip() {
  ci_log "SKIP: $*"
  exit 0
}

package_script_exists() {
  local script_name="$1"

  node -e '
const fs = require("node:fs");
const path = require("node:path");
const scriptName = process.argv[1];
const pkgPath = path.resolve(process.cwd(), "package.json");

if (!fs.existsSync(pkgPath)) process.exit(1);
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
process.exit(pkg.scripts && Object.prototype.hasOwnProperty.call(pkg.scripts, scriptName) ? 0 : 1);
' "$script_name"
}

run_first_pnpm_script() {
  local script_name

  for script_name in "$@"; do
    if package_script_exists "$script_name"; then
      ci_log "Running pnpm script: $script_name"
      pnpm run "$script_name"
      return 0
    fi
  done

  return 1
}

pick_default_web_server_command() {
  if package_script_exists preview; then
    echo "pnpm run preview -- --host 127.0.0.1 --port 4173"
    return 0
  fi

  if package_script_exists dev; then
    echo "pnpm run dev -- --host 127.0.0.1 --port 4173"
    return 0
  fi

  if package_script_exists start; then
    echo "pnpm run start -- --host 127.0.0.1 --port 4173"
    return 0
  fi

  return 1
}
