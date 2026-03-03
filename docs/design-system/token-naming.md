# Token Naming

## Goals
- Keep tokens semantic-first and implementation-agnostic.
- Keep names stable as visual values evolve.
- Follow DTCG fields: use `$type` and `$value` on token leaves.

## Hierarchy
- `primitives.*`: raw palette, spacing scale, radius scale, typography scale.
- `semantic.*`: product-facing tokens consumed by components.
- `modes/theme.*`: light/dark semantic overrides.
- `modes/density.*`: comfortable/compact spacing and sizing overrides.

## Naming Pattern
- Use `kebabCase` when emitted to CSS variables: `--ds-{category}-{group}-{token}`.
- Keep category vocabulary compact:
  - `color.bg.*`, `color.fg.*`, `color.border.*`
  - `space.*`, `size.*`, `radius.*`, `font.size.*`, `font.weight.*`, `shadow.*`, `motion.*`

## Rules
- Do not encode component names in global semantic tokens.
- Prefer intent over literal values (`color.bg.surface` not `color.gray.50`).
- Use references instead of duplicate raw values where possible.
- Add mode overrides only where behavior diverges by theme/density.
