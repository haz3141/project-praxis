# Architecture Canon

Date: 2026-03-03  
Status: Canonical architecture direction for docs and decision alignment.

## 1. Scope and Invariants

This canon applies to documentation and decision artifacts in this repo.

Non-negotiables:
- Planner-first MVP.
- Studio is secondary and pointer-only.
- Single core object universe (Task/Habit/Goal/Project/Note).
- Optional overlays are non-blocking.
- Offline-safe capture and sync replay for planner-critical flows.

## 2. Decision Precedence

When documents conflict, use this order:

1. `docs/decision/DECISION_MATRIX_COMPLETED.csv` (latest recommended decision posture).
2. Accepted ADRs in `docs/adrs/*`.
3. Constitutional constraints (`docs/constitution/01-core.md` to `05-backend.md`).
4. Supporting implementation/design docs.

Operational note:
- A decision becomes implementation-committed only when accepted in an ADR.

## 3. Current vs Target State

### Current State (Observed)

- Decision matrix recommends:
  - Planner + minimal Studio pointers (`docs/decision/DECISION_MATRIX_COMPLETED.csv:3`)
  - Solo-first MVP collaboration posture (`docs/decision/DECISION_MATRIX_COMPLETED.csv:11`)
  - Offline queue first, minimal canvas in V1 (`docs/decision/DECISION_MATRIX_COMPLETED.csv:35`)
  - Split frontend delivery (Astro site + app framework for planner) (`docs/decision/DECISION_MATRIX_COMPLETED.csv:48`)
  - Excalidraw recommendation (`docs/decision/DECISION_MATRIX_COMPLETED.csv:50`)
- Accepted ADR for Studio pointer-only records (`docs/adrs/ADR-0002-studio-pointer-only-layout.md:13`).
- Product doctrine still marks overlays/canvas as mandatory in v1 (`docs/constitution/02-product.md:177`), conflicting with optionality doctrine.

### Target State (Canonical)

- MVP scope:
  - Planner loop + object flows + offline-safe capture.
  - Studio minimal pointer surface only.
  - No mandatory insights/gamification/collaboration in MVP.
- Architecture posture:
  - Modular monolith backend with explicit boundaries.
  - Planner bundle isolation from Studio bundle.
  - Decision adoption tracked by ADR status.

## 4. Canonical Tree and Ownership

### 4.1 Canonical Tree

```text
docs/
  decision/
    DECISION_MATRIX_COMPLETED.csv      # decision source posture
    DECISION_TREE_MINDMAP.md
    EXEC_SUMMARY_ONE_PAGER.md
  adrs/
    ADR-0002-studio-pointer-only-layout.md
    ADR-0003-mvp-bootstrap-from-docs-only.md
  constitution/
    01-core.md
    02-product.md
    03-design.md
    04-frontend.md
    05-backend.md
  ARCHITECTURE_CANON.md                # this file
  DESIGN_SYSTEM_CANON.md
  FLOW_STATE_SOP.md
  MIGRATION_CHECKLIST.md
  AUDIT_MASTER.md
```

### 4.2 Ownership Model

- Product doctrine owner:
  - `docs/constitution/01-core.md`, `docs/constitution/02-product.md`
- Engineering architecture owner:
  - `docs/constitution/04-frontend.md`, `docs/constitution/05-backend.md`, `docs/adrs/*`
- Design system owner:
  - `docs/DESIGN_SYSTEM_CANON.md`, `docs/design-system/*`
- Decision governance owner:
  - `docs/decision/*` and decision-to-ADR promotion.

## 5. Required Architecture Contracts

1. Planner route performance and resilience
- Planner routes must remain low-JS, fast re-entry surfaces (`docs/constitution/04-frontend.md:240`).

2. Studio isolation
- Studio route can carry higher cost but must remain isolated (`docs/constitution/04-frontend.md:241`).

3. Pointer-only Studio model
- No duplicated object content in Studio layout records (`docs/adrs/ADR-0002-studio-pointer-only-layout.md:19`).

4. Offline-first execution path
- Queue and replay writes for offline capture (`docs/constitution/05-backend.md:165`).

## 6. Immediate Canonicalization Tasks

- [x] Add architecture canon document.
- [x] Define precedence rules and ownership.
- [ ] Reconcile `docs/constitution/02-product.md` MVP table with decision matrix recommendations.
- [ ] Add explicit “decision state” labels in constitution files where choices are exploratory vs committed.
- [x] Link this canon from `docs/README.md`.
