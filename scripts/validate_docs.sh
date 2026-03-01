#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

required_files=(
  "docs/constitution/00-template.md"
  "docs/constitution/01-core.md"
  "docs/constitution/02-product.md"
  "docs/constitution/03-design.md"
  "docs/constitution/04-frontend.md"
  "docs/constitution/05-backend.md"
)

required_sections=(
  "## 0. Purpose"
  "## 1. Inherited Constraints"
  "## 2. Thesis / Scope"
  "## 3. Architecture / Structure"
  "## 4. Operational Rules"
  "## 5. Scope Boundaries"
  "## 6. Metrics (If Applicable)"
  "## 7. Failure Modes"
  "## 8. Anti-Features"
  "## 9. Alignment Contracts"
  "## 10. Governance"
)

fail() {
  echo "[validate_docs] ERROR: $1" >&2
  exit 1
}

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || fail "Missing required file: $file"
done

for file in "${required_files[@]}"; do
  previous_line=0
  for section in "${required_sections[@]}"; do
    count="$(grep -cF "$section" "$file")"
    [[ "$count" -eq 1 ]] || fail "$file must contain section '$section' exactly once (found $count)"

    line_no="$(grep -nF "$section" "$file" | cut -d: -f1)"
    [[ "$line_no" -gt "$previous_line" ]] || fail "$file has out-of-order section '$section'"
    previous_line="$line_no"
  done

done

if rg -n 'https?://|\[[^]]+\]\([^)]*\)|||【|】|\[[0-9]+†L|Citations:' "${required_files[@]}" >/tmp/constitution_link_check.txt; then
  cat /tmp/constitution_link_check.txt >&2
  fail "Constitution docs contain forbidden links/citation artifacts"
fi

if rg -n '\[[0-9]+(?:\s*,\s*[0-9]+)*\]' "${required_files[@]}" >/tmp/constitution_numeric_citations.txt; then
  cat /tmp/constitution_numeric_citations.txt >&2
  fail "Constitution docs contain numeric citation anchors"
fi

if [[ -d .git ]]; then
  if ! git diff --quiet -- _import_from_drive; then
    fail "Source documents under _import_from_drive were modified"
  fi
fi

echo "[validate_docs] OK"
