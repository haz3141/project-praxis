# ADR-0003: Bootstrap MVP Runtime From Docs-Only Repository

## Status

Accepted

## Context

The repository started as constitutional and decision documentation only. Locked decisions dated 2026-03-02 require implementing a planner-first MVP with split delivery (`Next.js` planner app + `Astro` site shell), Supabase schema, offline queue posture, and CI accessibility gates.

## Decision

Bootstrap a pnpm workspace monorepo in-place:

- `apps/planner` for the Next.js planner runtime
- `apps/site` for Astro marketing/docs shell
- `packages/design-tokens` for DTCG-aligned token build artifacts
- `packages/ui` for shared accessible primitives
- `supabase/migrations` for schema + RLS
- `tests` and `.github/workflows` for CI quality gates

## Consequences

- Positive
  - Moves decisions from documentation into executable MVP slices.
  - Keeps split frontend delivery model aligned with the decision matrix.
  - Allows incremental commit scope per workstream without rewriting doctrine.
- Negative
  - Initial bootstrap introduces many new files and dependency surface.
  - CI and dependency install time increase from docs-only baseline.

## Alternatives Considered

- Build only planner and postpone Astro shell.
- Keep docs-only repo and create a separate runtime repository.
- Delay implementation until all V1 architecture decisions are finalized.
