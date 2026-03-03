# Project Praxis

Project Praxis constitutional documentation and implementation repository.

## Workspace Layout

- `apps/planner`: Next.js planner MVP application.
- `apps/site`: Astro marketing/docs shell.
- `packages/design-tokens`: DTCG-aligned token source and CSS variable build.
- `packages/ui`: shared UI primitives for planner surfaces.
- `supabase/migrations`: solo-first schema and RLS policies.
- `tests`: cross-app smoke, accessibility, and keyboard checks.

## Quickstart

- `pnpm install`
- `pnpm dev`
- `pnpm test:e2e`
- `pnpm lint`

## Validation

- `pnpm lint:md`
- `pnpm validate`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm test:e2e`
- `pnpm test:a11y`
