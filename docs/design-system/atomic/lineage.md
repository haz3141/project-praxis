# Pattern Lineage Policy

Every component must document both:
- Upstream dependencies (what it is composed from)
- Downstream usage (where it is used)

## Required lineage metadata
- `tier`: atom | molecule | organism | template | page
- `composes`: direct child components
- `usedBy`: templates/pages/routes

## Operational rules
- Renames and moves must update lineage references in the same PR.
- Template/page audits must feed gaps back into organism/molecule specs.
- Shared planner patterns are defined once and reused across routes.
