# Stitch Usage and Export Sources

Canonical Stitch operating guide: [audit.md](./audit.md)

Snapshot index: [exports.md](./exports.md)

Full live screen catalog (all four projects, all screens): [screens-catalog.md](./screens-catalog.md)

Machine-readable catalog export: [screens-catalog.csv](./screens-catalog.csv)

`exports.md` is generated from the latest available Stitch export snapshot for
Praxis UI Kit projects.

Current snapshot source files:
- `/tmp/praxis_uikit_exports.md`
- `/tmp/praxis_stitch_audit.md`

Preferred canonical project baseline: **Praxis UI Kit — Executive**.

Regenerate the full live catalog:
- `pnpm run stitch:catalog`

Notes:
- `/tmp` artifacts are ephemeral and should not be treated as canonical
  configuration.
- Canonical workflow standard is direct Stitch MCP; skills remain optional
  wrappers on top of MCP.
