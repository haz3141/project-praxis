# Documentation Migration Checklist

Date: 2026-03-03  
Status legend: `DONE`, `IN_PROGRESS`, `TODO`, `BLOCKED`

## A. Canon Establishment

1. `DONE` Add master audit document.
- Evidence: `docs/AUDIT_MASTER.md`

2. `DONE` Add design-system canon with multi-mode strategy (`light`/`dark`/`liquid-neon`).
- Evidence: `docs/DESIGN_SYSTEM_CANON.md`

3. `DONE` Add architecture canon with precedence and ownership.
- Evidence: `docs/ARCHITECTURE_CANON.md`

4. `DONE` Add flow-state SOP.
- Evidence: `docs/FLOW_STATE_SOP.md`

## B. Planner-First MVP Alignment

5. `IN_PROGRESS` Resolve optional-overlay contradiction in product doctrine.
- Evidence:
  - Optional/non-mandatory: `docs/constitution/02-product.md:19`
  - Mandatory in v1: `docs/constitution/02-product.md:177`
  - Optional/later in decision summary: `docs/decision/EXEC_SUMMARY_ONE_PAGER.md:17`
- Next action:
  - Patch `docs/constitution/02-product.md` section 5 and locked statement.

6. `IN_PROGRESS` Align collaboration MVP scope to solo-first recommendation.
- Evidence:
  - Solo-first recommended: `docs/decision/DECISION_MATRIX_COMPLETED.csv:11`
  - MVP sharing listed: `docs/constitution/02-product.md:171`
- Next action:
  - Move sharing to V1 in product doctrine.

7. `IN_PROGRESS` Normalize first-class object definition across docs.
- Evidence:
  - Includes insights as first-class: `docs/constitution/01-core.md:18`
  - First-class excludes insights: `docs/constitution/02-product.md:82`
  - Decision summary object set: `docs/decision/EXEC_SUMMARY_ONE_PAGER.md:6`
- Next action:
  - Normalize to Task/Habit/Goal/Project/Note first-class.

## C. Studio Pointer-Only Enforcement

8. `DONE` Studio pointer-only is accepted in ADR.
- Evidence: `docs/adrs/ADR-0002-studio-pointer-only-layout.md:13`

9. `TODO` Cross-link ADR pointer-only rule into product and design doctrine.
- Evidence:
  - Product already describes pointer behavior: `docs/constitution/02-product.md:60`
  - Design describes optional referencing canvas: `docs/constitution/03-design.md:128`
- Next action:
  - Add explicit ADR reference in both files.

## D. Design Canon Consolidation

10. `IN_PROGRESS` Resolve design-canon fragmentation between design docs.
- Evidence:
  - DS source-of-truth section: `docs/design-system/README.md:17`
  - Enhanced spec conversion tip: `docs/design-system/enhanced-spec.md:252`
  - Root design spec conflicting values: `DESIGN.md:147`, `docs/design-system/enhanced-spec.md:107`
- Next action:
  - Adopt semantic token precedence in `docs/DESIGN_SYSTEM_CANON.md`.
  - Mark secondary docs as generation/reference artifacts.

11. `TODO` Reconcile numeric token/component value diffs.
- Evidence:
  - Sidebar width mismatch: `DESIGN.md:147` vs `docs/design-system/enhanced-spec.md:107`
  - Border color mismatch: `DESIGN.md:27` vs `docs/design-system/enhanced-spec.md:29`
  - Checkbox size mismatch: `DESIGN.md:103` vs `docs/design-system/enhanced-spec.md:192`
- Next action:
  - Create token-level diff list and choose canonical values by semantic token.

## E. Architecture and Governance Hygiene

12. `DONE` Add architecture precedence and ownership map.
- Evidence: `docs/ARCHITECTURE_CANON.md`

13. `IN_PROGRESS` Clarify decision-state labels (exploratory vs committed).
- Evidence:
  - Exploratory language: `docs/constitution/05-backend.md:9`
  - Decision recommendations: `docs/decision/DECISION_MATRIX_COMPLETED.csv`
  - Locked decision context: `docs/adrs/ADR-0003-mvp-bootstrap-from-docs-only.md:9`
- Next action:
  - Add explicit status labels in constitution tech sections.

14. `TODO` Fix stale/non-portable evidence statements in governance docs.
- Evidence:
  - Invalid file pattern: `docs/constitution/STABILIZATION_REPORT.md:57`
  - Local path evidence in stitch audit: `docs/design-system/stitch/audit.md:171`
- Next action:
  - Replace with repo-relative, reproducible references.

## F. Validation Gate

15. `TODO` Run final consistency pass after constitution patches.
- Required checks:
  - Planner-first MVP preserved.
  - Studio pointer-only preserved.
  - `docs/decision` remains decision source.
  - No unresolved high-severity contradictions.
