# Atomic Accessibility Baseline

## Interaction rules
- Every interactive component includes `default`, `hover`, `focus-visible`, `active`, and `disabled` states.
- Inputs include valid and error semantics (`aria-invalid`, descriptive messaging).
- Dialogs/drawers support Escape close and focus return.

## Keyboard baseline
- Inbox and Today planner flows are keyboard-operable.
- Command palette, tabs, and overlays expose expected keyboard patterns.

## Contrast and focus
- Use semantic tokens for foreground/background/status colors.
- Preserve visible focus ring contrast in every theme/density mode.

## Fast re-entry alignment
- Critical planner actions must remain available even when overlays are present.
- Loading states should prefer skeleton/inline progress over blocking full-screen waits.
