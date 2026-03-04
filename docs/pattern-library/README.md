# Praxis Pattern Library (Astrum-Style Posture)

This directory mirrors a lightweight pattern-library export model:
- group folders
- each pattern with `markup.html` and `description.md`

Source snapshot: `docs/design-system/stitch/exports.md` and `docs/design-system/stitch/README.md`.

## Canonical policy
- Strategy: **cross-variant canonical matrix** across Calm, Executive, Minimal, and Desktop.
- Canonical slots: `00` through `05`.
- Representative screen per slot is selected via **median height with project-priority tie-break**.
- Policy source: `docs/pattern-library/registry.json` (`canonicalPolicy`).
- `liquid-neon` is a separate kit track and not part of this canonical matrix.

## Variant projects
- Praxis UI Kit — Calm (`13394915692903823935`)
- Praxis UI Kit — Executive (`5764765102702214376`)
- Praxis UI Kit — Minimal (`7285948406539466076`)
- Praxis UI Kit — Desktop (`5252820721296843802`)
- Praxis UI Kit — Liquid Neon (`970655054511238677`, tracked separately)

## Notes
- Snapshot includes per-slot cross-variant IDs plus one representative ID for docs and previews.
- Where raw html payloads are not materialized in-repo, scaffold markup is provided and linked to representative screen IDs.
