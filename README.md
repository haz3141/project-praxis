# Project Praxis

Project Praxis constitutional documentation and implementation repository.

## Workspace Layout

- `apps/planner`: Next.js planner MVP application.
- `apps/site`: Astro marketing/docs shell.
- `packages/design-tokens`: DTCG-aligned token source and CSS variable build.
- `packages/ui`: shared UI primitives for planner surfaces.
- `supabase/migrations`: solo-first schema and RLS policies.
- `tests`: cross-app smoke, accessibility, and keyboard checks.

## Validation

- `npm run lint:md`
- `npm run validate`
- `npm run lint`
- `npm run typecheck`
- `npm run test:unit`
- `npm run test:e2e`
- `npm run test:a11y`
