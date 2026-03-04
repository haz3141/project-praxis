# Accessibility Checklist (MVP)

## Foundation
- [x] Meets WCAG 2.2 AA contrast for text and controls.
- [x] Visible focus indicator on all interactive elements.
- [ ] Hit area target is at least ~44x44 CSS px for primary touch actions.
- [x] Supports keyboard-only navigation for all P0 flows.

## Semantics
- [x] Uses native HTML controls where possible.
- [x] Dialog and drawer use `role="dialog"`, `aria-modal`, and a labelled title.
- [x] Tabs use `tablist`, `tab`, `tabpanel`, and correct `aria-selected` wiring.
- [x] Form controls have programmatic labels and associated descriptions/errors.

## Behavior
- [x] Escape closes dismissible overlays.
- [x] Overlay close does not trap users without a keyboard path.
- [x] Validation errors set `aria-invalid` and are announced.
- [x] Toasts use polite/assertive live regions based on severity.

## Motion and Theming
- [x] Honors `prefers-reduced-motion`.
- [x] Light, dark, and liquid-neon themes preserve readability and state clarity.
- [ ] Comfortable and compact density both preserve target size rules.

## QA Pass
- [x] Keyboard walkthrough done for Button/Input/Checkbox/Select.
- [ ] Keyboard walkthrough done for Dialog/Drawer/Tabs.
- [ ] Screen-reader smoke test completed (VoiceOver or NVDA).

## Evidence (2026-03-04)

- `pnpm test:e2e:axe` passes for planner `/inbox` and `/today`.
- `pnpm test:e2e:keyboard` passes for planner `/inbox` and `/today`.
- `pnpm lint:ds:contrast` enforces contrast checks across light/dark/liquid-neon + comfortable/compact.
