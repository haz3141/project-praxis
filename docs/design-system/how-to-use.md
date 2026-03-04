# How to Use the Praxis Design System

## 1. Token Usage Rules

Use semantic DS tokens only. Do not hardcode hex/rgb/hsl values in UI components.

### Rules

- Use semantic CSS vars (`--ds-color-*`, `--ds-space-*`, `--ds-size-*`, `--ds-radius-*`).
- Keep component code token-driven; theme and density are controlled by attributes, not one-off overrides.
- Add new tokens under `packages/design-tokens/src/tokens`.
- Keep naming aligned with [`token-naming.md`](./token-naming.md).

### Do

```tsx
import { AtomicButton } from "@praxis/ui";

export function SaveButton() {
  return <AtomicButton variant="primary">Save</AtomicButton>;
}
```

```css
.panel {
  background: var(--ds-color-bg-surface);
  color: var(--ds-color-fg-default);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-md);
  padding: var(--ds-space-md);
}
```

### Don't

```css
.panel {
  background: #0b1020;
  color: rgb(230, 236, 255);
}
```

## 2. Theming and Density

Praxis theme and density are runtime attributes on `<html>`:

- `data-theme="light" | "dark" | "liquid-neon"`
- `data-density="comfortable" | "compact"`

Default planner contract:

```tsx
<html lang="en" data-theme="liquid-neon" data-density="comfortable">
```

Files:

- Theme/density contract defaults: `apps/planner/app/layout.tsx`
- Generated token output: `packages/design-tokens/dist/tokens.css`
- Theme source overrides: `packages/design-tokens/src/tokens/modes/theme.*.json`
- Density source overrides: `packages/design-tokens/src/tokens/modes/density.*.json`

### Switching and Persistence Strategy

- Use Settings UI controls to update `document.documentElement.dataset.theme` and `.dataset.density`.
- Persist in `localStorage` (recommended key: `praxis-ui-preferences-v1`).
- On app boot, read localStorage and apply before first paint where possible.

## 3. Component Usage

Primary React DS package:

- `@praxis/ui` from `packages/ui/src/components`

Prefer importing from package index:

```tsx
import { AtomicButton, AtomicInput, TaskRow, PriorityCard, SyncStatusPill } from "@praxis/ui";
```

Composition pattern:

- Atoms for controls (`AtomicInput`, `AtomicSelect`, `AtomicSwitch`, `AtomicButton`)
- Molecules for grouped semantics (`SearchField`, `SyncStatusPill`, `EmptyState`)
- Organisms/templates for screen structure (`TaskRow`, `PriorityCard`, `AtomicAppShell`, `TodayTemplate`)

## 4. Add a Token

1. Add/modify token JSON in:
   - `packages/design-tokens/src/tokens/semantic.json`
   - `packages/design-tokens/src/tokens/modes/theme.<name>.json`
   - `packages/design-tokens/src/tokens/modes/density.<name>.json`
2. Build tokens:

```bash
pnpm --filter @praxis/design-tokens build
```

3. Validate contrast contract:

```bash
pnpm lint:ds:contrast
```

4. Validate full DS lint:

```bash
pnpm lint:ds
```

## 5. Add a Component

1. Choose layer:
   - atom (`packages/ui/src/components/atoms`)
   - molecule (`packages/ui/src/components/molecules`)
   - organism/template (`packages/ui/src/components/organisms|templates`)
2. Implement tokenized styles in `packages/ui/src/styles.css`.
3. Export from `packages/ui/src/index.ts`.
4. Add Storybook stories under `packages/ui/src/stories/**`.
5. Meet a11y checklist:
   - keyboard reachable
   - visible focus state
   - min target size
   - semantic labeling and ARIA where needed
6. Run validation:

```bash
pnpm --filter @praxis/ui build
pnpm lint:ds
pnpm test:unit
```

## 6. Validation Commands (Local and CI)

### Local pre-push

```bash
pnpm -w install
pnpm --filter @praxis/design-tokens build
pnpm --filter @praxis/ui build
pnpm lint
pnpm lint:md
pnpm lint:ds
pnpm lint:ds:contrast
pnpm lint:architecture
pnpm test:unit
pnpm test:e2e:axe
pnpm test:e2e:keyboard
pnpm run stitch:validate
```

### Strict live DS gate (CI parity)

```bash
pnpm run ci:design-system
```

Requires env auth:

- `STITCH_API_KEY` or `STITCH_OAUTH_ACCESS_TOKEN`
- optional `STITCH_MCP_URL`

CI workflows run these gates via `.github/workflows/ci-gates.yml`.

## 7. Troubleshooting

### `lint:md` failures in skills/docs

- Ensure each `.agents/skills/**/SKILL.md` starts with YAML frontmatter delimiters (`---`).
- Run autofix first:

```bash
pnpm exec markdownlint-cli2 --fix "**/*.md" "!**/node_modules/**"
```

Then fix remaining issues manually.

### `stitch:validate` passes, `ci:design-system` fails

- `stitch:validate` can pass using local MCP config.
- `ci:design-system` is strict and requires env-based Stitch auth.
- Set `STITCH_API_KEY` or `STITCH_OAUTH_ACCESS_TOKEN` in CI secrets.

### Contrast gate failures

- Run `pnpm lint:ds:contrast` and inspect reported theme/density pair.
- Adjust semantic token values in theme mode JSON, then rebuild tokens.

### Missing frontmatter in skill docs

- Add a top `---` block with `name` and `description` at minimum.
- Re-run `pnpm lint:md`.

## 8. Usage Examples from Planner

### Example 1: Inbox capture + triage

- Route: `apps/planner/app/inbox/page.tsx`
- Recommended DS: `AtomicInput`, `AtomicTextarea`, `AtomicButton`, `TaskRow`, `EmptyState`

### Example 2: Today execution stack

- Route: `apps/planner/app/today/page.tsx`
- Recommended DS: `TodayTemplate`, `PriorityCard`, `TaskRow`, `SyncStatusPill`

### Example 3: Review loop output

- Route: `apps/planner/app/review/page.tsx`
- Recommended DS: `AtomicTextarea`, `AtomicButton`, `TaskRow` or `TableLite` for completed items

### Example 4: Global shell/navigation

- Component: `apps/planner/components/app-shell.tsx`
- Recommended DS: `AtomicAppShell`, `SyncStatusPill`, DS tokenized nav controls

## 9. Quick File Reference

- Tokens source: `packages/design-tokens/src/tokens/**`
- Tokens build output: `packages/design-tokens/dist/tokens.css`
- UI components: `packages/ui/src/components/**`
- UI exports: `packages/ui/src/index.ts`
- UI styles: `packages/ui/src/styles.css`
- Planner app: `apps/planner/app/**`
- CI gates: `.github/workflows/ci-gates.yml`
