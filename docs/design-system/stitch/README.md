# Stitch Usage and Export Sources

Canonical Stitch operating guide: [audit.md](./audit.md)

Snapshot index: [exports.md](./exports.md)

Full live screen catalog (all four projects, all screens): [screens-catalog.md](./screens-catalog.md)

Machine-readable catalog export: [screens-catalog.csv](./screens-catalog.csv)

`exports.md` is generated from `screens-catalog.csv` by the Stitch sync pipeline
(`pnpm run ds:sync:stitch`), with one canonical row per slot (`00` to `05`) per
project.

Preferred canonical project baseline: **Praxis UI Kit — Executive**.
Canonical prompt direction: **Neon** (high-contrast electric-blue accent
direction) unless a task explicitly requests another visual direction.

Regenerate the full live catalog:
- `pnpm run stitch:catalog`

Notes:
- `/tmp` artifacts are ephemeral and must not be treated as canonical input for
  repo docs.
- Canonical workflow standard is direct Stitch MCP; skills remain optional
  wrappers on top of MCP.
