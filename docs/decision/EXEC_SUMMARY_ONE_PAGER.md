# Project Praxis - Executive Summary One Pager

## 1) Praxis in 5 lines + non-negotiable core loop
- Praxis is a planner-first execution OS that turns intention into completion.
- Praxis is not a feed-first app, not a wiki-style everything app, and not coercive gamification.
- Praxis uses one object model: Tasks, Habits, Goals, Projects, Notes; overlays stay optional.
- Praxis is optimized for fast re-entry after interruption and low-friction daily planning.
- Praxis keeps Studio (canvas) optional so Planner remains primary.
- Non-negotiable loop: Capture -> Clarify -> Commit -> Complete -> Review.
- Deep detail: `docs/constitution/01-core.md`, `docs/constitution/02-product.md`.

## 2) Product requirements (P0/P1): objects, surfaces, MVP boundary, success metrics
- P0 invariants: planner-first, fast re-entry, objects-first, optional overlays.
- P0 objects: Task, Habit, Goal, Project, Note with shared IDs across all views.
- Surfaces: Planner (default, daily execution) and Studio (secondary, object-referencing canvas).
- MVP must ship: planner loop, object flows, lightweight review, offline-safe capture/sync replay.
- Keep optional/later: deep realtime collaboration, heavy gamification, broad automation.
- Success metrics: weekly completion quality, review adherence, and re-entry success after breaks.
- Sources: `docs/constitution/01-core.md`, `docs/constitution/02-product.md`, `docs/constitution/04-frontend.md`, `docs/constitution/05-backend.md`.

## 3) Design system direction: token posture, accessibility baseline, component taxonomy, UI benchmark shortlist
- Token posture: semantic token-first architecture with portable design-to-code mapping and mode support.
- Accessibility baseline: WCAG 2.2 AA, focus visibility, target size discipline, and non-drag alternatives.
- Top taxonomy: Foundations, Primitives, Navigation/Command, Data Display, Planning/Time, Collaboration, Reflection/Insights, Optional Canvas.
- Benchmark systems to study: Material, Atlassian, Carbon, Fluent 2, GOV.UK/USWDS class.
- Component references: UI Guideline Components index plus Component Gallery component taxonomy.
- Prototyping acceleration: Frames X, Untitled UI, Flowbite (prototype aid, not production truth).
- Sources: [UI Guideline Systems](https://www.uiguideline.com/systems), [UI Guideline Components](https://www.uiguideline.com/components), [UI Guideline Kits](https://www.uiguideline.com/kits), [Component Gallery Systems](https://component.gallery/design-systems/), [Component Gallery Components](https://component.gallery/components/), `docs/constitution/03-design.md`.

## 4) Tech stack decision space: framework, backend, data/auth, offline/PWA, canvas
- Frontend archetypes: Next.js (server-first React), Remix (progressive enhancement), SvelteKit (compiler-led).
- Backend shape: modular monolith first vs serverless-first composition vs early microservices.
- Data/auth options: Postgres + ORM + managed auth, Supabase integrated stack, Firebase integrated stack.
- Offline/PWA minimum: app shell cache, offline capture queue, idempotent replay, visible sync freshness.
- Canvas posture: Excalidraw open-source posture vs tldraw production-license posture.
- Sources: `docs/constitution/04-frontend.md`, `docs/constitution/05-backend.md`.

## 5) Competitive Insight: Nova (lightmode.io) vs Praxis
- Nova’s loop is a guided reflection or ritual loop (emotion-centric): guided reflection -> journaling -> habit review.
- Praxis’s loop is execution-centric and fixed: Capture -> Clarify -> Commit -> Complete -> Review.
- Nova is feed or experience-driven; Praxis is object and structure-driven.
- Nova excels in emotional UX and onboarding through meaning; Praxis excels in resilient execution and structural clarity.
- Potential augmentation for Praxis: guided reflective review prompts during the Praxis Review phase.
- What we borrow: emotional UX cues, onboarding ritualization, and supportive microcopy inside existing object-first flows.
- What we must avoid: feed-first behavior, streak obsession, soft accountability, and drift from structural clarity.
- Nova reference: [nova.lightmode.io](https://nova.lightmode.io/).

## 6) Decision checklist: exact questions to answer next
- Product: Which MVP surface scope ships first, how strict loop guidance should be, and what collaboration tier belongs in V1?
- Design: Do we lock DTCG-aligned token governance now, which accessibility gates are release blockers, and what MVP taxonomy is mandatory?
- Tech: Which frontend archetype wins the vertical slice benchmark, which data/auth stack minimizes lock-in risk, and what offline-canvas sequence protects Planner performance?

## 7) Output artifacts
- Decision Tree and Mindmap: [DECISION_TREE_MINDMAP.md](./DECISION_TREE_MINDMAP.md)
- Decision Matrix template: [DECISION_MATRIX_TEMPLATE.csv](./DECISION_MATRIX_TEMPLATE.csv)
- Atomic DS source docs: `docs/design-system/atomic/*`
- Stitch export snapshot index: `docs/design-system/stitch/exports.md`
