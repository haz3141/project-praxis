# Design System Canon

Date: 2026-03-03  
Status: Canonical design contract for implementation and review.

## 1. Canonical Intent

Praxis design must preserve:
- Planner-first MVP clarity.
- Fast re-entry after interruption.
- Studio as pointer-only secondary surface.
- Optional overlays that never block the planner loop.

This canon defines semantic design contracts. Visual flavor is themeable via token modes.

## 2. Theme Strategy

Three approved theme modes share one semantic token model:

1. `light` (planner-safe baseline)
- Primary baseline for Planner readability.
- Low-noise, high legibility, restrained motion.
- Matches execution-first doctrine.

2. `dark` (supported alternate)
- Alternate high-contrast mode for dark-surface workflows.
- Must preserve the same interaction and accessibility semantics as `light`.

3. `liquid-neon` (default runtime as of 2026-03-04, secondary expression layer)
- Neon glassmorphism variant used by current planner runtime defaults.
- Allowed in Studio and optional decorative contexts.
- Must never reduce readability or interfere with planner task completion.

Compatibility aliases for migration documentation:
- `calm` -> `light`
- `neon_holo` -> `liquid-neon`

Stitch canonical representative selection remains the core four kits
(Calm/Executive/Minimal/Desktop); Liquid Neon remains a separately tracked kit.

## 3. Semantic Tokens (Shared Contract)

All components consume semantic tokens, not raw hex values:

- `color.bg.app`
- `color.bg.surface`
- `color.bg.surface.elevated`
- `color.bg.glass`
- `color.border.default`
- `color.border.focus`
- `color.text.primary`
- `color.text.secondary`
- `color.text.muted`
- `color.action.primary`
- `color.action.primary.hover`
- `color.state.success`
- `color.state.warning`
- `color.state.danger`
- `radius.sm|md|lg|xl|full`
- `space.1..9` (8px base family)
- `elevation.0..4`
- `motion.fast|normal|slow`

## 4. Token Mode Values

### 4.1 Light Mode (Baseline)

- `color.bg.app`: `#FAFAFA`
- `color.bg.surface`: `#FFFFFF`
- `color.bg.surface.elevated`: `#FFFFFF`
- `color.border.default`: `#E2E4E9`
- `color.border.focus`: `rgba(79,70,229,0.40)`
- `color.text.primary`: `#111827`
- `color.text.secondary`: `#6B7280`
- `color.text.muted`: `#9CA3AF`
- `color.action.primary`: `#4F46E5`
- `color.action.primary.hover`: `#4338CA`

### 4.2 Liquid Neon Mode (Default Runtime, Secondary Expression)

- `color.bg.app`: `#060912`
- `color.bg.surface`: `rgba(13,18,32,0.72)`
- `color.bg.surface.elevated`: `rgba(20,28,48,0.78)`
- `color.bg.glass`: `linear-gradient(135deg, rgba(89,240,255,0.20), rgba(173,113,255,0.22) 45%, rgba(255,77,182,0.20))`
- `color.border.default`: `rgba(128,194,255,0.32)`
- `color.border.focus`: `rgba(89,240,255,0.72)`
- `color.text.primary`: `#EAF2FF`
- `color.text.secondary`: `#B4C5E6`
- `color.text.muted`: `#90A2C6`
- `color.action.primary`: `#59F0FF`
- `color.action.primary.hover`: `#36D7FF`

Required guardrails for `liquid-neon`:
- minimum 4.5:1 for body text contrast.
- no full-page blur under text-heavy planner lists.
- no animated gradients on task rows.

### 4.3 Dark Mode (Supported Alternate)

- `color.bg.app`: `#020617`
- `color.bg.surface`: `#0F172A`
- `color.bg.surface.elevated`: `#1E293B`
- `color.border.default`: `#334155`
- `color.border.focus`: `#6366F1`
- `color.text.primary`: `#F8FAFC`
- `color.text.secondary`: `#CBD5E1`
- `color.text.muted`: `#94A3B8`
- `color.action.primary`: `#6366F1`
- `color.action.primary.hover`: `#818CF8`

## 5. Components (Planner-First Priority)

P0 components:
- App shell (Planner-first nav hierarchy).
- Inbox capture input.
- Priority task card (max 3).
- Standard task row.
- Habit row.
- Review prompt card/modal.
- Button/input/select/checkbox primitives.
- Command palette.
- Toast/inline alert.

Studio-specific components (secondary):
- Canvas board.
- Pointer node for Task/Habit/Goal/Project/Note.
- Node inspector (layout metadata only).

Studio invariant:
- Node payload references entity pointer only (`entity_type`, `entity_id`) plus layout metadata.
- No duplicated task or note content in canvas records.

## 6. Motion Canon

Base timings:
- `motion.fast`: `120ms`
- `motion.normal`: `200ms`
- `motion.slow`: `350ms`

Rules:
- Planner routes: subtle transitions only; no decorative parallax.
- Studio routes: richer transition allowed, but no motion that blocks pointer operations.
- Respect `prefers-reduced-motion: reduce` with near-zero duration and no scale transforms.

## 7. Accessibility Canon

Baseline:
- WCAG 2.2 AA.
- Visible keyboard focus on all interactive elements.
- Non-drag alternatives for drag actions.
- Minimum target size 24x24 with adequate spacing.
- Color never as sole signal.

Route-specific checks:
- Planner `Inbox` and `Today` are release-blocking a11y surfaces.
- Studio is required to provide keyboard-accessible pointer operations for essential tasks.

## 8. Canonical Precedence For Design Docs

Within `docs/` scope, precedence is:

1. `docs/decision/*` for binding decision posture.
2. `docs/constitution/01-core.md`, `02-product.md`, `03-design.md`, `04-frontend.md`.
3. `docs/DESIGN_SYSTEM_CANON.md` (this file) for design contract.
4. `docs/design-system/atomic/*` for implementation detail scaffolding.
5. `docs/design-system/enhanced-spec.md` and root `DESIGN.md` as generation/reference artifacts, not canonical contract.

## 9. Adoption Checklist

- [x] Canon file created.
- [x] Map existing tokens in `packages/design-tokens/src/tokens` to semantic names above.
- [x] Add `mode=light` token output as semantic baseline.
- [x] Add `mode=dark` token output as supported alternate.
- [x] Add `mode=liquid-neon` token output with planner-safe guardrails.
- [x] Run contrast checks for all three modes on Planner core components (`pnpm lint:ds:contrast`).
