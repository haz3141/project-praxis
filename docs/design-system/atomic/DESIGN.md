# Praxis Semantic Design System (Desktop)

## Purpose
Praxis is planner-first: `Capture -> Clarify -> Commit -> Complete -> Review`. The interface must optimize orientation and fast re-entry.

## Variant layout specs
### Calm
- 12-col, max 1280, gutter 24, outer margin 80 at 1440
- spacing: 4/8/12/16/24/32/40/56/72
- type: H1 36/700, H2 28/600, H3 22/600, body 16/400, small 14, caption 12

### Executive
- 16-col, max 1440, gutter 32, outer margin 64
- spacing: 4-base with 64-96 macro section gaps
- type: H1 40, H2 30, H3 24, body 17

### Minimal
- 12-col, max 1200, gutter 20, outer margin 120
- spacing: 8-base with border-led separation and minimal shadows
- type: H1 34, H2 26, H3 20, body 16, heading tracking +0.01em

## Rules
- Semantic tokens for color/type/space/radius/elevation/motion/state/density
- Visible focus indicators and AA-minded contrast
- No hardcoded color literals in component implementation
