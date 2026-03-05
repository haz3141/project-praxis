# Stitch Usage and Export Sources

Canonical Stitch operating guide: [audit.md](./audit.md)

Snapshot index: [exports.md](./exports.md)

Full live screen catalog (core four projects plus separate Liquid Neon kit): [screens-catalog.md](./screens-catalog.md)

Machine-readable catalog export: [screens-catalog.csv](./screens-catalog.csv)

`exports.md` is generated from the latest available Stitch export snapshot for
Praxis UI Kit projects.

Current snapshot source files:
- `/tmp/praxis_uikit_exports.md`
- `/tmp/praxis_stitch_audit.md`

Canonical source strategy: **cross-variant canonical matrix** across the core
four kits (Calm, Executive, Minimal, Desktop), with representative screens
selected by median slot height and deterministic project-priority tie-break.

The Liquid Neon kit (`970655054511238677`) is tracked separately and is not
used to compute canonical representatives.

Regenerate the full live catalog:
- `pnpm run stitch:catalog`
- `pnpm run ds:sync:stitch`
- Optional overrides:
  - `STITCH_LIQUID_NEON_PROJECT_ID=<override_project_id>`
  - `STITCH_LIQUID_NEON_PROJECT_TITLE="<override_project_title>"`

Notes:
- `/tmp` artifacts are ephemeral and should not be treated as canonical
  configuration.
- Canonical workflow standard is direct Stitch MCP; Stitch skills are required
  wrappers for designated synthesis/generation workflows on top of MCP.
- Liquid Neon tracking uses seeded `get_screen` fallback in
  `scripts/stitch/export-screen-catalog.mjs` to ensure deterministic slot
  coverage for `00`-`05`.
