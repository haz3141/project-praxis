# Accessibility Checklist (MVP)

## Foundation
- [ ] Meets WCAG 2.2 AA contrast for text and controls.
- [ ] Visible focus indicator on all interactive elements.
- [ ] Hit area target is at least ~44x44 CSS px for primary touch actions.
- [ ] Supports keyboard-only navigation for all P0 flows.

## Semantics
- [ ] Uses native HTML controls where possible.
- [ ] Dialog and drawer use `role="dialog"`, `aria-modal`, and a labelled title.
- [ ] Tabs use `tablist`, `tab`, `tabpanel`, and correct `aria-selected` wiring.
- [ ] Form controls have programmatic labels and associated descriptions/errors.

## Behavior
- [ ] Escape closes dismissible overlays.
- [ ] Overlay close does not trap users without a keyboard path.
- [ ] Validation errors set `aria-invalid` and are announced.
- [ ] Toasts use polite/assertive live regions based on severity.

## Motion and Theming
- [ ] Honors `prefers-reduced-motion`.
- [ ] Light and dark themes preserve readability and state clarity.
- [ ] Comfortable and compact density both preserve target size rules.

## QA Pass
- [ ] Keyboard walkthrough done for Button/Input/Checkbox/Select.
- [ ] Keyboard walkthrough done for Dialog/Drawer/Tabs.
- [ ] Screen-reader smoke test completed (VoiceOver or NVDA).
