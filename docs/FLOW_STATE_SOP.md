# Flow-State SOP

Date: 2026-03-03  
Status: Standard operating procedure for docs-to-delivery flow.

## 1. Purpose

Define a repeatable workflow:
`discover -> decide -> implement -> validate -> ship`

This SOP enforces planner-first MVP, Studio pointer-only, and decision-first governance.

## 2. Stage 1: Discover

Goal: collect evidence and identify doctrine/decision conflicts before making changes.

Inputs:
- `docs/decision/*`
- `docs/constitution/*`
- ADRs in `docs/adrs/*`
- relevant design-system docs

Required outputs:
- Evidence list with exact `file:line`.
- Conflict list with severity.
- Scope statement (what will and will not change).

Exit criteria:
- Every planned change is mapped to a cited contradiction or gap.

## 3. Stage 2: Decide

Goal: select canonical direction using decision precedence.

Rule order:
1. Decision matrix completed.
2. Accepted ADRs.
3. Constitution constraints.
4. Supporting docs.

Required outputs:
- Decision log entry with:
  - chosen direction,
  - rejected alternatives,
  - doctrine references.

Exit criteria:
- No unresolved high-severity contradiction remains in chosen path.

## 4. Stage 3: Implement

Goal: apply minimal, direct changes in owned docs/artifacts.

Implementation rules:
- Prefer canonical docs over broad edits.
- Keep Studio content pointer-only.
- Keep optional overlays non-blocking and off-by-default.
- Avoid expanding MVP scope while resolving conflicts.

Required outputs:
- Direct edits to canonical docs.
- Patch-ready recommendations for out-of-scope files.

Exit criteria:
- New or updated canon files exist and are linked in docs index.

## 5. Stage 4: Validate

Goal: verify consistency and traceability after edits.

Validation checklist:
- All claims have evidence refs.
- No new contradiction against planner-first MVP.
- Decision precedence documented.
- Migration checklist updated with status.

Exit criteria:
- Audit file updated with severity-ranked findings and actions.

## 6. Stage 5: Ship

Goal: publish a clear handoff with actionable next steps.

Required ship payload:
- Summary of what changed.
- Changed file list.
- Outstanding recommendations (if any).
- Clear status of migration checklist.

Exit criteria:
- Team can execute next patch set without re-discovery.

## 7. Fast Failure Rules

Stop and re-open decision stage if:
- A proposed edit conflicts with `docs/decision/DECISION_MATRIX_COMPLETED.csv`.
- A doc introduces mandatory overlay behavior in MVP.
- A Studio document introduces duplicated object content.

## 8. Minimal Template

Use this template for each flow cycle:

```text
Cycle ID:
Scope:
Discover evidence:
Decision taken:
Implementation changes:
Validation result:
Ship summary:
Follow-up actions:
```
