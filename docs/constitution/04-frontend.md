# Project Praxis — Frontend Doctrine

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## 0. Purpose

_As of 2026-03-01 (America/New_York). This file is meant to stay useful as Praxis evolves, so it is **high-level, decision-oriented, and framework-agnostic** where possible._

## 1. Inherited Constraints

### Scope and Praxis constraints

This document defines the **frontend decision space** for Praxis: the frameworks, component models, styling systems, state/caching/offline posture, canvas feasibility, and quality gates that must be considered before implementation. It deliberately avoids locking the project into a single stack too early.

Praxis’ frontend constraints (from the internal mission brief) are treated as invariants:
- Web-first: **desktop web + mobile web** with responsive, touch-friendly, and keyboard-friendly UX.
- A primary **planner/execution surface** (tasks/habits/goals) with a secondary **studio/canvas** surface that must not become a separate data universe.
- Flexibility and customization without turning into an “everything app.”
- Collaboration should be supported conceptually from the start (even if realtime is later).
- Accessibility and resilience are non-negotiable for a daily-use product (especially on mobile web).

## 2. Thesis / Scope

### Stack archetypes to evaluate

Praxis can be built using multiple mature, modern web app approaches. The key is choosing which guarantees you want *the framework* to provide vs what you want to own yourselves.

### React meta-framework with server-first defaults

**Representative choice: Next.js.** Next.js documents explicit mechanisms for server/client composition and an application-wide caching model for rendering and data fetching.

Strengths that often map well to a planner-first app:
- Explicit caching and revalidation controls can support “fast re-entry” experiences if used intentionally.
- Server Actions + forms enable progressive enhancement patterns for write flows.
- Next.js provides guidance for building PWAs (manifest + service worker posture).

Tradeoffs to plan around:
- The server/client boundary and caching behavior can be complex; getting it wrong can create “stale data surprises.”
- If you want early offline-first behavior, you must design for it; it is not automatic.

### Islands and partial hydration with HTML-first defaults

**Representative choice: Astro.** Astro’s Islands architecture renders most of a page to HTML/CSS and hydrates only opted-in interactive islands; by default it strips client JS.
Astro also documents “server islands” for dynamic/personalized subregions without sacrificing caching for the rest of the page.

Strengths:
- Performance discipline is enforced architecturally (particularly valuable for mobile web).
- Useful if Praxis expects significant “content surfaces” (marketing, docs, onboarding) alongside the app.

Tradeoffs:
- Praxis’ planner is deeply interactive; if most screens become interactive islands, you may rebuild SPA-like patterns inside Astro and lose the simplicity benefits.
- Ecosystem conventions for complex “app state” are less standardized than React meta-frameworks.

### Hypermedia-first progressive enhancement (server-driven) React

**Representative choice: Remix.** Remix route modules export server `loader` and `action` functions and emphasize web fundamentals.
Remix explicitly embraces progressive enhancement—build flows that work without JavaScript, then enhance them.

Strengths:
- Excellent for forms-heavy workflows (capture/triage/edit/review) that remain resilient on weak networks.
- Nested routing can reduce jarring transitions and keep layout stable.

Tradeoffs:
- Canvas/Studio will still be heavily client-driven.
- Teams often need stronger internal conventions for client-side UI complexity than in “server-first” screens.

### Compiler-led app framework

**Representative choice: SvelteKit.** SvelteKit provides client/server rendering, routing, `load` functions, and server-side form actions; it runs `load` functions concurrently and batches server `load` results during navigations.
It also leans into web fundamentals such as `<a>` navigation.

Strengths:
- Svelte’s compilation model often yields very responsive UIs and smaller bundles.
- Built-in progressive enhancement patterns (e.g., `use:enhance`).

Tradeoffs:
- If the team is React-first today, a switch affects hiring, libraries, and long-term ecosystem choices.

## 3. Architecture / Structure

### Frontend architecture contracts

This section defines the contracts that should hold regardless of framework choice. These are the decisions that keep Praxis modular and avoid “everything app” collapse.

### Component model options

**Framework-native components (React/Svelte)**
Best for velocity and ecosystem leverage. For React ecosystems, “headless/unstyled accessibility primitives” reduce opinionated styling while preserving robust behaviors:
- Radix Primitives (unstyled, accessible React primitives).
- React Aria (accessibility + interactions + i18n-focused primitives).
- Headless UI (unstyled accessible components, Tailwind-friendly).
- Ariakit (lower-level accessible primitives).
- Ark UI (headless components across multiple frameworks).

Ownership option (reduces vendor lock-in): shadcn/ui provides copy‑paste components intended to be owned/customized in-repo.

**Web Components (custom elements + Shadow DOM)**
Web Components are browser standards: custom elements, Shadow DOM, templates/slots.
Shadow DOM provides encapsulation and protects internals from accidental outside CSS/JS breakage.

Use cases:
- You want long-term cross-framework portability.
- You want strong style encapsulation boundaries.

Risks:
- Theming across Shadow DOM requires deliberate token propagation strategy.
- Some app-level composition patterns are less ergonomic than framework-native components.

**Hybrid (recommended posture for flexibility)**
Default to framework-native components for the product, and reserve Web Components for a future phase if portability becomes a clear requirement.

### State layers and caching posture

Praxis will need clear separation of:
- server state (tasks/projects shared across devices and collaborators),
- local UI state (panels, filters, reorder mode, focus targets),
- “capture state” (fast inbox entry),
- optional offline queues and optimistic UI.

If you want a framework-agnostic client cache layer, common open-source options include:
- TanStack Query for caching, invalidation, and background refetch behavior.
- SWR for a minimal “stale‑while‑revalidate” model with caching and deduplication.

For local UI state:
- Zustand emphasizes a small, less opinionated API.
- Redux recommends Redux Toolkit as the official approach for Redux apps.

Framework-native caching considerations:
- Next.js documents how caching works and how APIs interact; this should be treated as an early learning objective if Next.js is selected.

### Offline and PWA posture

A PWA typically combines a web manifest and a service worker (for offline support).
MDN describes caching strategies as algorithms for when to cache, when to serve cache, and when to use network.
Workbox documents runtime caching strategies such as stale‑while‑revalidate.

Framework guidance examples:
- Next.js provides a PWA guide.
- Astro can integrate `vite-plugin-pwa` via `@vite-pwa/astro`.

A “minimum viable offline” posture that stays future-proof:
- Cache the “app shell” + core assets for fast re-entry.
- Allow offline inbox capture into a queue and replay on reconnect (even if only for tasks at first).
- Show user-visible freshness indicators (last sync time / offline badge).
MDN highlights how offline content freshness is bounded by the last successful sync unless you refresh in background.

### Design system, styling, and token pipeline

### Design system versus kits and benchmarks

A design system is best treated as a living set of standards (components, patterns, and style rules) to manage design at scale.
UI kits are commonly accelerators—especially for Figma workflows—but are not governance by themselves.
UI Guideline provides benchmark lists of popular design systems and Figma kits, which can help you sanity-check patterns without copying them blindly.

### Token-first architecture that won’t age badly

Material Design describes design tokens as “building blocks” used across design and code.
Carbon shows token layering and contextual tokens for mapping UI layers.

To reduce tool lock-in, consider aligning your token storage with the Design Tokens Community Group specification, designed for exchanging tokens across tools.
Token tooling examples:
- Tokens Studio (Figma plugin for token workflows).
- Style Dictionary (token build system; supports DTCG).

### Styling approaches to keep open

Keep styling flexible until you prototype the planner core + a minimal Studio route. Modern, widely used options:

- CSS Modules (component-scoped CSS; supported in Next.js).
- Tailwind (utility-first; v4 emphasizes tokens as CSS variables by default).
- vanilla-extract (zero-runtime CSS in TypeScript, emits static CSS at build time).
- CSS container queries for component-level responsiveness.

A practical, future-proof bias is to prefer styling that generates **static CSS** (CSS Modules, Tailwind, vanilla-extract) rather than heavy runtime styling, because it tends to be SSR-friendly and reduces hydration complexity.

### Studio canvas surface

The Studio/canvas should remain a secondary surface. The key frontend contract is: **core objects are the source of truth; the canvas stores layout metadata and pointers.**

### Canvas engine options and licensing realities

Excalidraw is MIT licensed and open source. Its repo describes app features such as PWA offline support, realtime collaboration, and local-first autosave (browser).

tldraw provides a high-performance canvas SDK, but its repo states that **production use requires a license key** (development use is free).

This is why canvas choice is a strategic decision: it’s not just technical—it can be a licensing and lock-in decision.

### Collaboration-ready patterns

If/when Studio becomes collaborative, two classes of tools matter:

- CRDT data models like Yjs (shared types merge without conflicts).
- Collaboration infrastructure like Liveblocks (rooms, presence, shared state).

This document does not prescribe one; it flags the frontend implications: optimistic UI, conflict handling, and presence rendering.

### Accessibility constraints for canvas and drag

WCAG 2.2 includes a requirement that dragging interactions have a non-drag alternative.
This affects both task reordering and canvas interactions. Plan alternatives such as:
- “Move up/down” controls for reorder lists,
- accessible “position” panels for canvas nodes,
- keyboard shortcuts for common operations where feasible.

## 4. Operational Rules

### Accessibility baseline

WCAG 2.2 provides an authoritative baseline for web accessibility.
Criteria with direct impact on Praxis’ interaction-heavy UI:
- Target size/spacing reduces mis-taps.
- Dragging movements need single-pointer alternatives.
- Focus should not be obscured by overlays/sticky UI.
- Accessible authentication reduces cognitive burden at login.

Use ARIA Authoring Practices patterns for custom widgets.

### Testing stack (open source defaults)

- Vitest for unit/integration tests.
- Storybook for developing and documenting components in isolation.
- Playwright for cross-browser E2E testing (Chromium, Firefox, WebKit; mobile emulation).

Accessibility automation:
- axe-core is an open-source rules engine covering WCAG rulesets.
- Playwright documents using axe for WCAG scanning in tests.

## 5. Scope Boundaries

Not Applicable.

## 6. Metrics (If Applicable)

### Performance budgets and user-centric metrics

Core Web Vitals provide unified user-centric performance metrics (LCP, INP, CLS).
Set separate budgets for:
- planner routes (must feel instant, low JS),
- Studio route (allowed higher cost, but isolated from planner bundles),
- key interactions (complete, capture, reschedule).

## 7. Failure Modes

Not Applicable.

## 8. Anti-Features

Not Applicable.

## 9. Alignment Contracts

### Decision artifacts that keep the project flexible

Create lightweight artifacts that prevent re-litigation while preserving optionality:
- A “decision matrix” comparing the four archetypes (Next, Astro, Remix, SvelteKit) against Praxis constraints.
- An “irreversibility ledger” for choices that are expensive to undo: framework, component model, token pipeline, canvas engine, offline posture.
- Architecture Decision Records (ADRs) stored in-repo, one per major decision.

A practical evaluation sequence:
- Build one vertical slice (Today + Inbox capture + habits streak micro-visual + one modal/drawer), then add a minimal Studio route as an isolated bundle.
- Run it through accessibility checks (target size, focus, drag alternatives) and performance budgets (LCP/INP/CLS).
- Only then commit to a stack with full context.

## 10. Governance

### Quality gates and decision process

Quality gates and decision artifacts are binding for frontend stack selection and evolution.
