# Design System v0

Praxis MVP uses a token-first, accessibility-first design system with
cross-variant Stitch evidence.

## Contents

- [Atomic System](./atomic/README.md)
- [Token Naming](./token-naming.md)
- [Component Spec Template](./component-spec-template.md)
- [Accessibility Checklist](./accessibility-checklist.md)
- [Microcopy Tone](./microcopy-tone.md)
- [Stitch Exports](./stitch/exports.md)
- [Stitch Audit & Runbook](./stitch/audit.md)
- [Stitch Full Screen Catalog](./stitch/screens-catalog.md)
- [Registry Scaffold](./registry/README.md)

## Source of Truth

- Token sources: `packages/design-tokens/src/tokens`
- Generated CSS variables: `packages/design-tokens/dist/tokens.css`
- UI primitives: `packages/ui/src/components`
- Atomic matrix: `docs/design-system/atomic/component-matrix.json`
- Stitch inventory + canonical matrix:
  `docs/design-system/registry/data/stitch-inventory.json`
- Pattern slot mapping:
  `docs/pattern-library/registry.json`

## Variant Architecture

- Default variants: `light`, `dark`
- Separate Stitch kit: `liquid-neon` (kept independent from the core four kits)
- Surface policy:
  planner routes remain WCAG-first and readability constrained, while studio
  surfaces can use stronger liquid-glass/neon emphasis.
