# ADR-0002: Studio Canvas Uses Pointer-Only Layout Records

## Status

Accepted

## Context

Studio canvas needs persistent placement data for tasks, habits, goals, and notes, while entity content remains owned by each domain table. For offline-first sync and idempotent replay, layout records must stay small and stable so that updates are conflict-light and easy to merge.

## Decision

Store only pointer and placement fields in `studio_canvas_layout`:

- Pointer identity: `entity_type` + `entity_id`
- Placement: `x`, `y`, `width`, `height`, `z_index`, `collapsed`
- Optional lightweight view metadata in `meta`

Do not store duplicated entity content (title/body/description/etc.) in studio layout records. Enforce this by:

- SQL constraint that rejects content-like keys in `meta`
- TypeScript schema guard in Studio adapter utilities that rejects forbidden keys

## Consequences

- Positive effects
  - Eliminates stale duplicated content inside canvas layout data
  - Keeps offline queue payloads smaller and idempotency keys more stable
  - Simplifies conflict handling because layout and domain content sync independently
- Negative effects
  - Canvas render path must resolve pointers to domain entities before displaying labels/content
  - Extra join or client-side lookup is required at render time
- Follow-up obligations
  - Keep Studio UI adapters pointer-only when adding new entity types
  - Expand forbidden-key checks if new content-like fields are introduced

## Alternatives Considered

- Option A: Store full entity snapshots in layout rows
- Option B: Store mixed pointer + denormalized content fields
- Option C: Pointer-only rows with explicit invariant checks (selected)

## Amendment Scope

- `supabase/migrations/20260302120000_solo_first_mvp_schema.sql`
- `apps/planner/src/features/studio/layoutSchema.ts`
- `apps/planner/src/features/studio/layoutAdapter.ts`

