# Web Design Guidelines Audit - 2026-03-02

## Scope
- `apps/planner/app/**/*.{ts,tsx,css}`
- `apps/planner/components/**/*.{ts,tsx,css}`
- `apps/planner/src/**/*.{ts,tsx,css}`
- `packages/**/src/**/*.{ts,tsx,css}`
- Rules source: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`

## Severity Summary
- P0: 0
- P1: 9
- P2: 12

## Findings

### apps/planner/components/command-palette.tsx
- `apps/planner/components/command-palette.tsx:46` - Clickable `<div>` backdrop controls dialog state; interactive `div` anti-pattern.
- `apps/planner/components/command-palette.tsx:54` - Palette `<input>` has no explicit label or `aria-label`.
- `apps/planner/components/command-palette.tsx:54` - Palette `<input>` missing meaningful `name` and `autocomplete` attributes.
- `apps/planner/components/command-palette.tsx:55` - `autoFocus` is unconditional; guideline says avoid default mobile autofocus.
- `apps/planner/components/command-palette.tsx:59` - Placeholder copy should end with ellipsis character (`…`) and example format.
- `apps/planner/components/command-palette.tsx:61` - `role="listbox"` used with button children; listbox semantics mismatch.

### apps/planner/app/inbox/page.tsx
- `apps/planner/app/inbox/page.tsx:36` - Task title input missing `name` and `autocomplete` attributes.
- `apps/planner/app/inbox/page.tsx:41` - Placeholder should end with ellipsis character (`…`).
- `apps/planner/app/inbox/page.tsx:48` - Notes textarea missing `name` and explicit autocomplete strategy.
- `apps/planner/app/inbox/page.tsx:52` - Placeholder should end with ellipsis character (`…`).

### apps/planner/app/review/page.tsx
- `apps/planner/app/review/page.tsx:29` - Review textarea missing `name` and explicit autocomplete strategy.
- `apps/planner/app/review/page.tsx:33` - Placeholder should end with ellipsis character (`…`).
- `apps/planner/app/review/page.tsx:56` - `toLocaleString()` used inline; standardize with `Intl.DateTimeFormat` formatter.
- `apps/planner/app/review/page.tsx:64` - `toLocaleString()` used inline; standardize with `Intl.DateTimeFormat` formatter.

### apps/planner/components/studio/studio-pointer-panel.tsx
- `apps/planner/components/studio/studio-pointer-panel.tsx:83` - `toLocaleTimeString()` used inline; standardize with `Intl.DateTimeFormat` formatter.

### apps/planner/components/app-shell.tsx
- `apps/planner/components/app-shell.tsx:62` - Main content region has no skip-link entry point; add skip navigation target.

### packages/ui/src/styles.css
- `packages/ui/src/styles.css:148` - Dialog container missing `overscroll-behavior: contain` for modal scroll isolation.
- `packages/ui/src/styles.css:216` - Drawer container missing `overscroll-behavior: contain` for sheet/drawer behavior.
- `packages/ui/src/styles.css:38` - Shared interactive button class lacks explicit `touch-action: manipulation`.

### packages/ui/src/components/Input.tsx
- `packages/ui/src/components/Input.tsx:23` - Label is optional without fallback accessible-name requirement; easy to render unlabeled controls.

### packages/ui/src/components/Select.tsx
- `packages/ui/src/components/Select.tsx:30` - Label is optional without fallback accessible-name requirement; easy to render unlabeled controls.

## Top 10 Fixes (Minimal Diff)
1. Add a skip link in shell/layout (`Skip to main content`) and set `id="main-content"` on the `<main>` in `app-shell.tsx`.
2. Replace clickable palette overlay `div` behavior with non-interactive wrapper + explicit backdrop button semantics.
3. Add `aria-label`, `name`, and `autoComplete="off"` to command palette input; keep tokenized styling unchanged.
4. Add `name` + explicit autocomplete strategy to Inbox and Review form fields (`inbox-title`, `inbox-notes`, `review-note`).
5. Normalize placeholder copy to ellipsis character (`…`) in planner forms and command palette.
6. Introduce a tiny shared formatter helper (planner UI layer) using `Intl.DateTimeFormat` and replace inline `toLocale*String()` calls.
7. Align command palette list semantics: either switch to semantic list (`ul/li`) or adopt proper `option` semantics for `listbox`.
8. Add `overscroll-behavior: contain` to `.ds-dialog` and `.ds-drawer` in `packages/ui/src/styles.css`.
9. Add `touch-action: manipulation` to the shared button class (`.ds-button`, optionally planner button utility classes).
10. Harden `Input`/`Select` API with an accessible-name contract (require `label` or `'aria-label'`) while preserving component signatures via a narrow type guard.

## Notes
- No product behavior was changed in this phase.
- Findings are intentionally terse and optimized for backlog conversion.
