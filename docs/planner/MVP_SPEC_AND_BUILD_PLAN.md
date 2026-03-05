# Planner MVP Spec and Build Plan

## 1. Product Direction

Praxis remains planner-first, accessibility-first, and keyboard-first. The default visual contract is `liquid-neon` + `comfortable`, with user switchability for theme and density.

This plan uses one object universe and keeps Studio pointer-only.

## 2. Brainstormed Concepts

### Concept A (Selected): Loop Command Center (Today-first)

- IA/routes: keep current IA; strengthen `/inbox`, `/today`, `/settings` as MVP core.
- Core interaction: capture -> commit -> complete -> review loop.
- DS emphasis: `AtomicAppShell`, `TodayTemplate`, `PriorityCard`, `TaskRow`, `SyncStatusPill`, `AtomicInput`, `AtomicTextarea`, `AtomicSelect`, `AtomicSwitch`, `EmptyState`.
- Risk: low.

### Concept B: Keyboard Triage Queue (Inbox-first)

- IA/routes: inbox queue with details drawer; today as execution lane.
- DS emphasis: `TableLite`, `DrawerPanel`, `SearchField`, `TaskRow`.
- Risk: medium (focus management and triage complexity).

### Concept C: Review-led Daily Cycle

- IA/routes: Today split into plan/do/review tabs.
- DS emphasis: `Tabs`, `Modal`, review-heavy patterns.
- Risk: medium-high (state fragmentation, higher a11y burden).

## 3. Selected MVP Scope

### In scope

- Keep existing routes in navigation (`/inbox`, `/today`, `/week`, `/habits`, `/goals`, `/review`, `/studio`) and add `/settings`.
- Build MVP quality screens: Inbox, Today, Settings.
- Enforce DS-only styling/controls on MVP screens.
- Add Project and Note objects to align with single object universe.
- Persist theme/density preferences in localStorage.
- Maintain WCAG 2.2 AA baseline with axe/keyboard checks.

### Out of scope (post-MVP)

- Full project management UI flows.
- Realtime collaboration.
- Expanded automation/esoteric overlays.
- Studio feature expansion beyond pointer-only behavior.

## 4. IA and Routes

- `/inbox`: fast capture and commit to today.
- `/today`: execution stack and completion flow.
- `/settings`: theme/density preferences and accessibility toggles.
- Existing non-MVP routes remain available and unchanged unless required for data model compatibility.

## 5. Data Model (Local-first)

Local state + localStorage in planner store.

### Entities

- `Task`: `id`, `title`, `notes`, `status`, `createdAt`, `scheduledFor`, `completedAt`, optional `projectId`.
- `Habit`: existing shape.
- `Goal`: existing shape.
- `Project` (new): `id`, `title`, `status`, `createdAt`.
- `Note` (new): `id`, `body`, `kind` (`review` | `general`), `createdAt`, optional links (`taskId`, `goalId`, `projectId`).

### Storage

- Continue `praxis-planner-v1` with backward-compatible hydration.
- Add defaults for `projects` and `notes` when absent in stored payload.

## 6. DS Component Map

### Existing components to use

- Atoms: `AtomicButton`, `AtomicInput`, `AtomicTextarea`, `AtomicSelect`, `AtomicSwitch`, `AtomicCheckbox`.
- Molecules: `SearchField`, `SyncStatusPill`, `EmptyState`.
- Organisms/templates: `TaskRow`, `PriorityCard`, `AtomicAppShell`, `TodayTemplate`.

### Expected additions (if needed)

- Minimal planner-specific molecule only when existing DS components cannot express required behavior.
- Any new DS component must include story + tokenized styles + exports.

## 7. Milestones, Tests, and Acceptance Criteria

### Milestone 1: Settings and theme/density persistence

Implementation:

- Add `/settings` screen.
- Add navigation/command-palette entry.
- Apply selected theme/density to `<html data-theme data-density>`.
- Persist settings in localStorage.

Tests:

- Unit: preference state hydrate/save.
- E2E: settings change persists across reload.
- A11y keyboard: controls are tab reachable and labeled.

Acceptance criteria:

- Theme can switch among `light`, `dark`, `liquid-neon`.
- Density can switch `comfortable`/`compact`.
- Reload preserves settings.

### Milestone 2: Inbox DS migration

Implementation:

- Replace app-local inputs/buttons/rows with DS components.
- Keep capture and commit behavior unchanged.

Tests:

- Existing smoke flow still captures and commits.
- Axe scan passes for inbox.

Acceptance criteria:

- No hardcoded colors in DS component layer.
- Inbox functionality parity maintained.

### Milestone 3: Today DS migration

Implementation:

- Use `TodayTemplate`, `PriorityCard`, `TaskRow`, `SyncStatusPill` where applicable.
- Remove inline style usage in Today screen.

Tests:

- Smoke flow still completes task and surfaces in review notes list.
- Axe + keyboard checks pass for today.

Acceptance criteria:

- Today remains functional with DS-only presentation.
- Visual state remains readable in all themes/density modes.

### Milestone 4: Object-universe alignment (Project + Note)

Implementation:

- Add `Project` and `Note` types and store support.
- Replace review-specific model usage with Note kind `review`.
- Extend studio pointer entity type support to include `project` while remaining pointer-only.

Tests:

- Unit tests for schema/store defaults and migration safety.
- Existing behavior for review flow remains intact.

Acceptance criteria:

- Store and types include all five object families (Task, Habit, Goal, Project, Note).
- No studio payload duplication; pointer-only constraints remain enforced.

### Milestone 5: Final QA + CI parity

Run:

```bash
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

If secrets available:

```bash
pnpm run ci:design-system
```

Acceptance criteria:

- All required local gates pass.
- Strict DS gate behavior unchanged.

## 8. Success Metrics

- Capture-to-commit cycle remains under 2 interactions for common path.
- Keyboard-only completion of Inbox -> Today -> Complete remains viable.
- Axe serious/critical violations remain zero for Inbox, Today, Settings.
- Theme/density preference persistence works across browser reload.

## 9. Implementation Command Sequence

```bash
# start from integrated dev line
pnpm -w install
pnpm --filter @praxis/design-tokens build
pnpm --filter @praxis/ui build
pnpm lint
pnpm test:unit
pnpm test:e2e:axe
pnpm test:e2e:keyboard
pnpm run stitch:validate
```

## 10. Risks and Mitigations

- Risk: Playwright flakiness/port collisions.
  - Mitigation: run e2e/a11y sequentially and avoid parallel commands sharing port 4173.
- Risk: theme regression when applying localStorage settings.
  - Mitigation: default attributes in layout + explicit hydration fallback.
- Risk: object-model migration causes review regressions.
  - Mitigation: backward-compatible hydrate transform and unit coverage.
