# Praxis Documentation Audit Master

Date: 2026-03-03  
Scope: `docs/*` and decision artifacts (`docs/decision/*`)  
Doctrine constraints: planner-first MVP, Studio pointer-only, `docs/decision` as decision source.

## Severity-Ranked Findings

### Critical

1. Optional overlays are declared non-blocking/off-by-default, but later made mandatory in MVP/v1 scope.
- Evidence:
  - `docs/constitution/02-product.md:19` says overlays are optional and never mandatory.
  - `docs/constitution/02-product.md:169` includes Insights in MVP.
  - `docs/constitution/02-product.md:170` includes Gamification in MVP.
  - `docs/constitution/02-product.md:177` says Canvas basics, insight capsule, and companion are must-have by v1.
  - `docs/decision/EXEC_SUMMARY_ONE_PAGER.md:17` says heavy gamification and broad automation are optional/later.
- Impact: breaks planner-first MVP boundary and creates contradictory scope commitments.
- Patch-ready recommendation:
  - In `docs/constitution/02-product.md`, change MVP rows for Insights/Gamification to optional experiments and remove mandatory language at line 177.
  - Keep core MVP required set aligned to planner loop + object flows + offline-safe capture.

### High

2. Collaboration scope conflicts between Product doctrine and decision matrix recommendation.
- Evidence:
  - `docs/constitution/02-product.md:171` includes project sharing in MVP.
  - `docs/decision/DECISION_MATRIX_COMPLETED.csv:11` recommends solo-first MVP.
- Impact: roadmap ambiguity for permissions/auth work and delivery sequencing.
- Patch-ready recommendation:
  - Update `docs/constitution/02-product.md` MVP collaboration row to solo-first.
  - Move sharing to V1 and link to `docs/decision/DECISION_MATRIX_COMPLETED.csv` line 11.

3. Canonical object model is inconsistent (insight first-class vs derivative optional layer).
- Evidence:
  - `docs/constitution/01-core.md:18` lists insights as first-class in non-negotiables.
  - `docs/constitution/02-product.md:82` first-class objects omit insight/companion.
  - `docs/constitution/02-product.md:84` calls insight/companion derivative optional layers.
  - `docs/decision/EXEC_SUMMARY_ONE_PAGER.md:6` canonical one-model set is Task/Habit/Goal/Project/Note.
- Impact: schema and ownership ambiguity in product/design/backend docs.
- Patch-ready recommendation:
  - Normalize all docs to one rule: first-class = Task/Habit/Goal/Project/Note; overlays = optional derivative objects.
  - Add a single canonical sentence in `docs/constitution/01-core.md` and cross-reference in `docs/constitution/02-product.md`.

4. Design system has competing canonical documents with conflicting values.
- Evidence:
  - `docs/design-system/README.md:17` defines source of truth in packages/atomic only.
  - `docs/design-system/enhanced-spec.md:252` says it should be converted into `DESIGN.md`.
  - `DESIGN.md:147` sidebar 260px vs `docs/design-system/enhanced-spec.md:107` sidebar 240px.
  - `DESIGN.md:27` border token `#E2E4E9` vs `docs/design-system/enhanced-spec.md:29` `#E5E7EB`.
  - `DESIGN.md:103` checkbox 20px vs `docs/design-system/enhanced-spec.md:192` checkbox 18px.
- Impact: token/component drift and inconsistent implementation output.
- Patch-ready recommendation:
  - Declare one canonical design doc in `docs/` and explicitly mark generation prompts/non-canonical docs as secondary.
  - Use semantic tokens as stable contract, allow variant themes as token modes.

### Medium

5. Core loop naming drifts across constitutional docs.
- Evidence:
  - `docs/constitution/01-core.md:17` loop: Capture -> Clarify -> Commit -> Complete -> Review.
  - `docs/constitution/03-design.md:17` loop: Inbox -> Today -> Done -> Review -> Repeat.
- Impact: analytics/event taxonomy drift and mixed UX copy.
- Patch-ready recommendation:
  - Keep one canonical loop string in core/product docs.
  - Treat design wording as view labels, not loop contract.

6. Backend doctrine presents architecture decisions as non-final while decision artifacts and ADRs present committed direction.
- Evidence:
  - `docs/constitution/05-backend.md:9` says decisions are not final.
  - `docs/decision/DECISION_MATRIX_COMPLETED.csv:29`, `:33`, `:35`, `:48` have recommended MVP-bias decisions.
  - `docs/adrs/ADR-0003-mvp-bootstrap-from-docs-only.md:9` states locked decisions dated 2026-03-02.
- Impact: uncertainty about which architectural choices are binding now.
- Patch-ready recommendation:
  - Add explicit precedence and decision state policy.
  - Distinguish “recommended in decision matrix” from “accepted in ADR.”

7. Validation report references a non-existent constitutional path pattern.
- Evidence:
  - `docs/constitution/STABILIZATION_REPORT.md:57` references `docs/constitution/00-05.md`.
- Impact: false validation evidence trail.
- Patch-ready recommendation:
  - Replace with explicit file list (`00-template.md`, `01-core.md`, `02-product.md`, `03-design.md`, `04-frontend.md`, `05-backend.md`).

### Low

8. Stitch audit uses machine-local evidence paths in canonical section.
- Evidence:
  - `docs/design-system/stitch/audit.md:26` uses `/tmp/praxis_stitch_audit.md`.
  - `docs/design-system/stitch/audit.md:171` includes `/tmp` evidence.
  - `docs/design-system/stitch/audit.md:172-173` include user-local config paths.
- Impact: reduced reproducibility for team readers.
- Patch-ready recommendation:
  - Keep local paths in “local-only evidence” appendix.
  - Promote repo-resident artifacts as canonical evidence.

## Safe Direct Edits Applied In This Patch

1. Added `docs/DESIGN_SYSTEM_CANON.md`.
2. Added `docs/ARCHITECTURE_CANON.md`.
3. Added `docs/FLOW_STATE_SOP.md`.
4. Added `docs/MIGRATION_CHECKLIST.md`.
5. Added this audit file `docs/AUDIT_MASTER.md`.
6. Updated `docs/README.md` to surface the new canonical docs.
7. Updated `docs/design-system/README.md` to reference the design-system canon.

## Proposed Next Patch Set (Not Applied Here)

1. `docs/constitution/02-product.md`
- Remove mandatory wording for optional overlays in MVP.
- Align collaboration MVP with solo-first decision recommendation.

2. `docs/constitution/01-core.md`
- Align first-class object list to decision canon (Task/Habit/Goal/Project/Note).

3. `docs/constitution/03-design.md`
- Keep loop copy as UX labels but point to core loop contract from `01-core.md`.

4. `docs/constitution/05-backend.md`
- Add explicit decision state markers: exploratory vs adopted vs accepted ADR.

5. `docs/constitution/STABILIZATION_REPORT.md`
- Fix file existence statement at line 57.
