# Project Praxis - Executive Summary One Pager

## 1) Praxis in 5 lines + non-negotiable core loop
- Praxis is a planner-first execution OS for turning intentions into completed actions.
- Praxis is not a wiki-style everything app, not a social feed, and not a coercive streak game.
- Praxis keeps one shared object model: Tasks, Habits, Goals, Projects, Notes (with optional Insights/Companion overlays).
- Praxis prioritizes fast re-entry after interruption and low-friction daily planning.
- Praxis keeps Studio (canvas) optional so Planner remains primary.
- Non-negotiable loop: Capture -> Clarify -> Commit -> Complete -> Review.  
  Deep detail: `docs/constitution/01-core.md`, `docs/constitution/02-product.md`.

## 2) Product requirements (P0/P1): objects, surfaces, MVP boundary, success metrics
- P0 objects and invariants:
  - First-class objects: Task, Habit, Goal, Project, Note; views are virtual and share IDs.
  - Invariants: Planner-first, fast re-entry, objects-first, optional overlays.
  - Source: `docs/constitution/01-core.md`, `docs/constitution/02-product.md`.
- P0 surfaces:
  - Planner (Home) is the default surface for Today/Week/Habits/Goals/Projects.
  - Studio (Canvas) is secondary and references core objects only.
  - Source: `docs/constitution/02-product.md`, `docs/constitution/04-frontend.md`.
- MVP boundary:
  - Must ship: Planner loop, basic object flows, lightweight review, offline-safe capture.
  - Keep optional or later: deep realtime collaboration, heavy gamification, broad automation.
  - Source: `docs/constitution/02-product.md`, `docs/constitution/05-backend.md`.
- Success metrics:
  - Weekly completion quality and review adherence are primary.
  - Re-entry success after breaks is a core resilience metric.
  - Source: `docs/constitution/01-core.md`, `docs/constitution/02-product.md`.

## 3) Design system direction: token posture, accessibility baseline, component taxonomy, UI benchmark shortlist
- Token posture:
  - Semantic token-first system with design-to-code portability and mode support.
  - Prefer stable categories: color, typography, spacing, radius/elevation, motion, component tokens.
  - Source: `docs/constitution/03-design.md`, `docs/constitution/04-frontend.md`.
- Accessibility baseline:
  - WCAG 2.2 AA baseline with keyboard focus clarity, target sizing, and non-drag alternatives.
  - Source: `docs/constitution/03-design.md`, `docs/constitution/04-frontend.md`.
- Top-level component taxonomy:
  - Foundations, Primitives, Navigation and Command, Data Display, Planning and Time, Collaboration, Reflection and Insights, Optional Canvas.
  - Source: `docs/constitution/03-design.md`.
- UI benchmark shortlist (curated and decision-oriented):
  - Design systems: Material Design, Atlassian Design System, Carbon Design System, Fluent 2, GOV.UK/USWDS class.
    - Sources: [UI Guideline Systems](https://www.uiguideline.com/systems), [Atlassian DS](https://www.uiguideline.com/systems/atlassian-design-system), [Carbon DS](https://www.uiguideline.com/systems/carbon-design-system), [Fluent 2](https://www.uiguideline.com/systems/fluent2), [Component Gallery Design Systems](https://component.gallery/design-systems/)
  - Component taxonomy references: UI Guideline Components index, Component Gallery Components index, Table pattern, Button pattern.
    - Sources: [UI Guideline Components](https://www.uiguideline.com/components), [Component Gallery Components](https://component.gallery/components/), [Table Pattern](https://component.gallery/components/table/), [Button Pattern](https://component.gallery/components/button/)
  - UI kits for acceleration: Frames X, Untitled UI, Flowbite.
    - Sources: [UI Guideline Kits](https://www.uiguideline.com/kits), [Frames X](https://www.uiguideline.com/kits/frames-x), [Untitled UI](https://www.uiguideline.com/kits/untitled-ui), [Flowbite](https://www.uiguideline.com/kits/flowbite)

## 4) Tech stack decision space: framework, backend, data/auth, offline/PWA, canvas
- Frontend archetype options:
  - Next.js (server-first React), Remix (progressive enhancement), SvelteKit (compiler-led).
  - Source: `docs/constitution/04-frontend.md`.
- Backend architecture options:
  - Modular monolith first, serverless-first composition, or early microservices.
  - Source: `docs/constitution/05-backend.md`.
- Data and auth options:
  - Postgres + ORM + managed auth, Supabase integrated stack, Firebase integrated stack.
  - Source: `docs/constitution/05-backend.md`.
- Offline/PWA posture:
  - Minimum bar is offline capture queue + idempotent replay + visible sync freshness.
  - Source: `docs/constitution/04-frontend.md`, `docs/constitution/05-backend.md`.
- Canvas engine posture:
  - Excalidraw (open-source posture) vs tldraw (license-governed production use).
  - Source: `docs/constitution/04-frontend.md`.

## 5) Decision checklist: exact questions to answer next
- Product:
  - Which MVP surface scope do we ship first: Planner-only or Planner + minimal Studio?
  - How strict should the loop be in UI: guided prompts or hard gating?
  - What collaboration scope is in V1: roles-only sharing or realtime editing?
- Design:
  - Do we commit to a DTCG-aligned semantic token pipeline at day 1?
  - Which accessibility gates are blocking CI criteria for beta?
  - Which taxonomy subset is required for MVP component completeness?
- Tech:
  - Which frontend archetype wins the vertical slice benchmark for Planner speed and resilience?
  - Which data/auth combo gives best reliability with lowest lock-in risk?
  - What offline and canvas scope is feasible without breaking Planner performance?

## 6) Output artifacts
- Decision Tree and Mindmap: [DECISION_TREE_MINDMAP.md](./DECISION_TREE_MINDMAP.md)
- Decision Matrix template: [DECISION_MATRIX_TEMPLATE.csv](./DECISION_MATRIX_TEMPLATE.csv)
