# @praxis/design-tokens

DTCG-aligned semantic tokens (`$type`/`$value`) and a small build step that emits CSS custom properties for theme and density variants.

## Build

```bash
pnpm build
```

Output is generated in `dist/tokens.css` and `dist/tokens.resolved.json`.
Also emits `dist/tokens.json` (source-oriented token bundle for docs/tooling).
