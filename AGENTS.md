# Agent Operating Rules

## Branch and Git Hygiene

- Work from `dev` as the integration baseline.
- Create short-lived feature branches from `dev` for implementation work.
- Merge feature branches into `dev` via pull request.
- Keep `main` and `dev` aligned when no other active release/hotfix branches are in progress.
- Never commit directly to `main` or `dev`.
- Use atomic Conventional Commits.
- Run relevant checks before each commit (`lint`, `typecheck`, tests, and build for affected scope).

## Package Manager

- Use `pnpm` only. Do not use npm or yarn in this repository.
- Quickstart:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm test:e2e`
  - `pnpm lint`

## Implementation Posture

- Decision artifacts in `docs/decision` are source of truth for implementation choices.
- Keep MVP scope tight: planner-first with optional overlays off by default.
- Maintain a single object universe for Tasks, Habits, Goals, Projects, and Notes.
- Studio remains pointer-only and must not become a second data universe.

## Accessibility and Quality

- Target WCAG 2.2 AA baseline for planner surfaces.
- Keep automated a11y checks in CI at minimum for Inbox and Today routes.
- Keep planner and studio bundles isolated; studio libraries must not bloat planner routes.

## AI/Docs Guidance

- Always use the OpenAI developer docs MCP server for OpenAI/Codex/API questions.
