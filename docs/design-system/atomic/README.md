# Praxis Atomic Design System

Praxis design system is planner-first and token-first.

## Product constraints
- Core loop: `Capture -> Clarify -> Commit -> Complete -> Review`
- Fast re-entry after interruption is non-negotiable.
- Insights/gamification overlays are tertiary and cannot dominate planner surfaces.
- UI tone is calm, high-clarity, and non-gamified.

## Atomic taxonomy
- Atoms: smallest reusable primitives (Button, Input, Badge, Text, Surface)
- Molecules: small compositions (LabeledField, SearchField, TaskMeta)
- Organisms: functional sections (TaskRow, PriorityCard, AppShell, Modal, TableLite)
- Templates: route-level structures (Today, Week, Inbox, Review)
- Pages: product routes that bind real data and workflow behavior

## Source of truth
- Matrix: [component-matrix.json](./component-matrix.json)
- Accessibility: [accessibility.md](./accessibility.md)
- Governance: [governance.md](./governance.md)
- Lineage policy: [lineage.md](./lineage.md)
- Content rules: [content-guidelines.md](./content-guidelines.md)

## Token policy
- Components must consume semantic/component tokens only.
- Hardcoded color literals in components are disallowed.
- Density mode (`comfortable` / `compact`) is token-driven and required for planner components.
- Component paddings must be token-backed CSS variables (`var(--ds-*)`) to prevent spacing drift.

## Hardening baseline
- Story coverage for planner-critical controls includes `hover`, `focus-visible`, `disabled`, and `loading` states.
- `Button` and `TaskRow` are the minimum state-coverage baseline for each DS hardening pass.
- DS guard scripts run via `pnpm run lint:ds` and include color, spacing scale, and component-padding checks.
