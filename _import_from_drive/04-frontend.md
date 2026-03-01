# Frontend Tech Stack Principles and Options for Project Praxis

_As of 2026-03-01 (America/New_York). This file is meant to stay useful as Praxis evolves, so it is **high-level, decision-oriented, and framework-agnostic** where possible._

## Scope and Praxis constraints

This document defines the **frontend decision space** for Praxis: the frameworks, component models, styling systems, state/caching/offline posture, canvas feasibility, and quality gates that must be considered before implementation. It deliberately avoids locking the project into a single stack too early.

Praxis’ frontend constraints (from the internal mission brief) are treated as invariants:
- Web-first: **desktop web + mobile web** with responsive, touch-friendly, and keyboard-friendly UX.
- A primary **planner/execution surface** (tasks/habits/goals) with a secondary **studio/canvas** surface that must not become a separate data universe.
- Flexibility and customization without turning into an “everything app.”
- Collaboration should be supported conceptually from the start (even if realtime is later).
- Accessibility and resilience are non-negotiable for a daily-use product (especially on mobile web).

## Stack archetypes to evaluate

Praxis can be built using multiple mature, modern web app approaches. The key is choosing which guarantees you want *the framework* to provide vs what you want to own yourselves.

### React meta-framework with server-first defaults

**Representative choice: Next.js.** Next.js documents explicit mechanisms for server/client composition and an application-wide caching model for rendering and data fetching. citeturn0search12turn0search0turn0search4

Strengths that often map well to a planner-first app:
- Explicit caching and revalidation controls can support “fast re-entry” experiences if used intentionally. citeturn0search0turn0search8
- Server Actions + forms enable progressive enhancement patterns for write flows. citeturn11search2turn11search21
- Next.js provides guidance for building PWAs (manifest + service worker posture). citeturn2search2

Tradeoffs to plan around:
- The server/client boundary and caching behavior can be complex; getting it wrong can create “stale data surprises.” citeturn0search0turn0search8
- If you want early offline-first behavior, you must design for it; it is not automatic.

### Islands and partial hydration with HTML-first defaults

**Representative choice: Astro.** Astro’s Islands architecture renders most of a page to HTML/CSS and hydrates only opted-in interactive islands; by default it strips client JS. citeturn0search1turn11search3  
Astro also documents “server islands” for dynamic/personalized subregions without sacrificing caching for the rest of the page. citeturn0search16

Strengths:
- Performance discipline is enforced architecturally (particularly valuable for mobile web). citeturn0search1turn11search3
- Useful if Praxis expects significant “content surfaces” (marketing, docs, onboarding) alongside the app.

Tradeoffs:
- Praxis’ planner is deeply interactive; if most screens become interactive islands, you may rebuild SPA-like patterns inside Astro and lose the simplicity benefits.
- Ecosystem conventions for complex “app state” are less standardized than React meta-frameworks.

### Hypermedia-first progressive enhancement (server-driven) React

**Representative choice: Remix.** Remix route modules export server `loader` and `action` functions and emphasize web fundamentals. citeturn0search2turn0search20  
Remix explicitly embraces progressive enhancement—build flows that work without JavaScript, then enhance them. citeturn11search0

Strengths:
- Excellent for forms-heavy workflows (capture/triage/edit/review) that remain resilient on weak networks. citeturn11search0turn0search2
- Nested routing can reduce jarring transitions and keep layout stable. citeturn0search20

Tradeoffs:
- Canvas/Studio will still be heavily client-driven.
- Teams often need stronger internal conventions for client-side UI complexity than in “server-first” screens.

### Compiler-led app framework

**Representative choice: SvelteKit.** SvelteKit provides client/server rendering, routing, `load` functions, and server-side form actions; it runs `load` functions concurrently and batches server `load` results during navigations. citeturn0search7turn0search3  
It also leans into web fundamentals such as `<a>` navigation. citeturn0search11

Strengths:
- Svelte’s compilation model often yields very responsive UIs and smaller bundles.
- Built-in progressive enhancement patterns (e.g., `use:enhance`). citeturn11search5turn11search8

Tradeoffs:
- If the team is React-first today, a switch affects hiring, libraries, and long-term ecosystem choices.

## Frontend architecture contracts

This section defines the contracts that should hold regardless of framework choice. These are the decisions that keep Praxis modular and avoid “everything app” collapse.

### Component model options

**Framework-native components (React/Svelte)**  
Best for velocity and ecosystem leverage. For React ecosystems, “headless/unstyled accessibility primitives” reduce opinionated styling while preserving robust behaviors:
- Radix Primitives (unstyled, accessible React primitives). citeturn3search7turn3search23  
- React Aria (accessibility + interactions + i18n-focused primitives). citeturn7search1turn7search11turn7search5  
- Headless UI (unstyled accessible components, Tailwind-friendly). citeturn7search0turn7search18  
- Ariakit (lower-level accessible primitives). citeturn7search6  
- Ark UI (headless components across multiple frameworks). citeturn7search2  

Ownership option (reduces vendor lock-in): shadcn/ui provides copy‑paste components intended to be owned/customized in-repo. citeturn7search7turn7search3turn7search12

**Web Components (custom elements + Shadow DOM)**  
Web Components are browser standards: custom elements, Shadow DOM, templates/slots. citeturn1search4turn1search8turn1search12  
Shadow DOM provides encapsulation and protects internals from accidental outside CSS/JS breakage. citeturn1search0

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
- TanStack Query for caching, invalidation, and background refetch behavior. citeturn9search0turn9search12  
- SWR for a minimal “stale‑while‑revalidate” model with caching and deduplication. citeturn9search1turn9search9  

For local UI state:
- Zustand emphasizes a small, less opinionated API. citeturn9search2turn9search6  
- Redux recommends Redux Toolkit as the official approach for Redux apps. citeturn9search7turn9search15  

Framework-native caching considerations:
- Next.js documents how caching works and how APIs interact; this should be treated as an early learning objective if Next.js is selected. citeturn0search0turn0search8

### Offline and PWA posture

A PWA typically combines a web manifest and a service worker (for offline support). citeturn2search11turn2search8  
MDN describes caching strategies as algorithms for when to cache, when to serve cache, and when to use network. citeturn2search0  
Workbox documents runtime caching strategies such as stale‑while‑revalidate. citeturn2search1turn2search9  

Framework guidance examples:
- Next.js provides a PWA guide. citeturn2search2  
- Astro can integrate `vite-plugin-pwa` via `@vite-pwa/astro`. citeturn2search15turn2search3  

A “minimum viable offline” posture that stays future-proof:
- Cache the “app shell” + core assets for fast re-entry.
- Allow offline inbox capture into a queue and replay on reconnect (even if only for tasks at first).
- Show user-visible freshness indicators (last sync time / offline badge).  
MDN highlights how offline content freshness is bounded by the last successful sync unless you refresh in background. citeturn2search4

## Design system, styling, and token pipeline

### Design system versus kits and benchmarks

A design system is best treated as a living set of standards (components, patterns, and style rules) to manage design at scale. citeturn4search19turn3search12  
UI kits are commonly accelerators—especially for Figma workflows—but are not governance by themselves. citeturn4search1turn4search5  
UI Guideline provides benchmark lists of popular design systems and Figma kits, which can help you sanity-check patterns without copying them blindly. citeturn4search0turn4search1turn4search4

### Token-first architecture that won’t age badly

Material Design describes design tokens as “building blocks” used across design and code. citeturn3search1turn3search5  
Carbon shows token layering and contextual tokens for mapping UI layers. citeturn3search2turn3search14  

To reduce tool lock-in, consider aligning your token storage with the Design Tokens Community Group specification, designed for exchanging tokens across tools. citeturn8search4turn8search0turn8search8  
Token tooling examples:
- Tokens Studio (Figma plugin for token workflows). citeturn8search3turn8search22  
- Style Dictionary (token build system; supports DTCG). citeturn8search10turn8search16turn8search18  

### Styling approaches to keep open

Keep styling flexible until you prototype the planner core + a minimal Studio route. Modern, widely used options:

- CSS Modules (component-scoped CSS; supported in Next.js). citeturn6search2  
- Tailwind (utility-first; v4 emphasizes tokens as CSS variables by default). citeturn6search15turn6search0  
- vanilla-extract (zero-runtime CSS in TypeScript, emits static CSS at build time). citeturn6search1turn6search5turn6search19  
- CSS container queries for component-level responsiveness. citeturn6search3turn6search23  

A practical, future-proof bias is to prefer styling that generates **static CSS** (CSS Modules, Tailwind, vanilla-extract) rather than heavy runtime styling, because it tends to be SSR-friendly and reduces hydration complexity.

## Studio canvas surface

The Studio/canvas should remain a secondary surface. The key frontend contract is: **core objects are the source of truth; the canvas stores layout metadata and pointers.**

### Canvas engine options and licensing realities

Excalidraw is MIT licensed and open source. Its repo describes app features such as PWA offline support, realtime collaboration, and local-first autosave (browser). citeturn14view0  

tldraw provides a high-performance canvas SDK, but its repo states that **production use requires a license key** (development use is free). citeturn13view0  

This is why canvas choice is a strategic decision: it’s not just technical—it can be a licensing and lock-in decision.

### Collaboration-ready patterns

If/when Studio becomes collaborative, two classes of tools matter:

- CRDT data models like Yjs (shared types merge without conflicts). citeturn10search0turn10search4turn10search12  
- Collaboration infrastructure like Liveblocks (rooms, presence, shared state). citeturn10search9turn10search20turn10search1  

This document does not prescribe one; it flags the frontend implications: optimistic UI, conflict handling, and presence rendering.

### Accessibility constraints for canvas and drag

WCAG 2.2 includes a requirement that dragging interactions have a non-drag alternative. citeturn12search2  
This affects both task reordering and canvas interactions. Plan alternatives such as:
- “Move up/down” controls for reorder lists,
- accessible “position” panels for canvas nodes,
- keyboard shortcuts for common operations where feasible.

## Quality gates and decision process

### Accessibility baseline

WCAG 2.2 provides an authoritative baseline for web accessibility. citeturn12search4turn1search1  
Criteria with direct impact on Praxis’ interaction-heavy UI:
- Target size/spacing reduces mis-taps. citeturn12search1  
- Dragging movements need single-pointer alternatives. citeturn12search2  
- Focus should not be obscured by overlays/sticky UI. citeturn12search3  
- Accessible authentication reduces cognitive burden at login. citeturn12search0  

Use ARIA Authoring Practices patterns for custom widgets. citeturn1search18turn1search10

### Performance budgets and user-centric metrics

Core Web Vitals provide unified user-centric performance metrics (LCP, INP, CLS). citeturn1search11turn1search15turn1search7  
Set separate budgets for:
- planner routes (must feel instant, low JS),
- Studio route (allowed higher cost, but isolated from planner bundles),
- key interactions (complete, capture, reschedule).

### Testing stack (open source defaults)

- Vitest for unit/integration tests. citeturn5search1turn5search3  
- Storybook for developing and documenting components in isolation. citeturn5search2turn5search4  
- Playwright for cross-browser E2E testing (Chromium, Firefox, WebKit; mobile emulation). citeturn5search0turn5search12  

Accessibility automation:
- axe-core is an open-source rules engine covering WCAG rulesets. citeturn5search7turn5search5  
- Playwright documents using axe for WCAG scanning in tests. citeturn5search18  

### Decision artifacts that keep the project flexible

Create lightweight artifacts that prevent re-litigation while preserving optionality:
- A “decision matrix” comparing the four archetypes (Next, Astro, Remix, SvelteKit) against Praxis constraints.
- An “irreversibility ledger” for choices that are expensive to undo: framework, component model, token pipeline, canvas engine, offline posture.
- Architecture Decision Records (ADRs) stored in-repo, one per major decision.

A practical evaluation sequence:
- Build one vertical slice (Today + Inbox capture + habits streak micro-visual + one modal/drawer), then add a minimal Studio route as an isolated bundle.
- Run it through accessibility checks (target size, focus, drag alternatives) and performance budgets (LCP/INP/CLS).
- Only then commit to a stack with full context.