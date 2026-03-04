# Liquid Neon Design System Guide

This guide documents what is shipped for the `liquid-neon` variant and how to adopt it safely.

## What Is Built

- Theme mode: `liquid-neon` in `packages/design-tokens/src/tokens/modes/theme.liquid-neon.json`.
- Density modes: `comfortable` and `compact`.
- Runtime selector contract: `data-theme` + `data-density` attributes.
- Generated outputs:
  - `packages/design-tokens/dist/tokens.css`
  - `packages/design-tokens/dist/tokens.resolved.json`
  - `packages/design-tokens/dist/tokens.json`
- Planner runtime default:
  - `apps/planner/app/layout.tsx` sets `data-theme="liquid-neon"` and `data-density="comfortable"`.
- Accessibility/quality gates:
  - `pnpm test:e2e:axe` for Inbox/Today serious+critical checks
  - `pnpm test:e2e:keyboard` for focus reachability and progression
  - `pnpm lint:ds:contrast` for theme/density contrast coverage

## How To Use

1. Build tokens:
   - `pnpm --filter @praxis/design-tokens build`
2. Ensure token CSS is imported once in app root:
   - `@praxis/design-tokens/dist/tokens.css`
3. Select mode at runtime:
   - `<html data-theme="liquid-neon" data-density="comfortable">`
4. Consume semantic CSS variables only:
   - Example: `var(--ds-color-bg-surface)`, `var(--ds-color-fg-default)`, `var(--ds-shadow-card)`
5. Keep component styling token-backed:
   - No hardcoded color literals in UI components
   - No literal spacing/padding outside approved DS gates

## Mode Matrix

- Themes: `light`, `dark`, `liquid-neon`
- Densities: `comfortable`, `compact`
- Total variants generated: 6

## Guardrails

- Planner readability stays primary over decorative effects.
- Liquid Neon remains a separate Stitch kit track (not collapsed into core four canonical kits).
- Contrast and accessibility checks must pass before merge:
  - `pnpm lint:ds`
  - `pnpm test:e2e:axe`
  - `pnpm test:e2e:keyboard`
