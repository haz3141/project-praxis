# Atomic DS Governance

## Change control
- All DS changes use Conventional Commits and include impacted layers: docs, tokens, components, stories, checks.
- New components require docs + stories + accessibility notes + token mapping.
- Breaking API or token contract changes require a decision artifact in `docs/decision`.

## Acceptance gate for new/changed components
- Defined atomic tier and ownership
- Explicit variants and states
- Density mappings for `comfortable` and `compact`
- Keyboard and focus behavior documented
- Token mapping complete (no hardcoded color literals)
- Storybook stories for state coverage (`hover`, `focus-visible`, `disabled`, `loading` minimum for planner-critical controls)
- DS lint guards enforced (`lint:ds:colors`, `lint:ds:spacing`, `lint:ds:paddings`)

## Quality baseline
- WCAG 2.2 AA intent for planner surfaces
- Visible focus rings on all interactive controls
- Planner/studio bundle boundaries remain enforced
