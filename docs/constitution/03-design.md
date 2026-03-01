# Project Praxis — Design Doctrine

## Version 1.0
## Status: Foundational
## Last Updated: 2026-03-01

## 0. Purpose

### Purpose and durable UX principles

This document is the **high-level, decision-enabling UI/UX blueprint** for **Project Praxis**. It is written to stay useful through multiple iterations by focusing on **durable principles, requirements, and decision frames** rather than locking in a visual style too early. The intent is to make later decisions faster and safer—especially when you start implementing.

Project Praxis is being designed as a **Life OS execution system** whose primary driver is **tasks, habits, and goals**, with an optional “insight overlay” that can include esoteric augmentation (e.g., astrology/human design) without hijacking the primary loop. A design system approach exists to reduce redundancy and create a shared language and consistency as the product grows.

**Core UX thesis (Praxis definition applied):** Praxis means turning understanding into lived practice through action and reflection; Praxis UX therefore prioritizes a virtuous cycle of *capture → plan → act → review → improve* rather than static organization.

**Primary user loop (non-negotiable):** Inbox → Today → Done → Review → Repeat (with habits and goals woven through). This loop must remain fast on mobile web and powerful on desktop web.

**Definitions that prevent confusion later**
- **Design system:** a set of standards (with components, patterns, and guidance) used to manage design at scale, reduce redundancy, and maintain a shared language and consistency across UI surfaces.
- **UI kit / component kit:** a packaged library of ready-made design components/templates (often Figma-based) that speeds prototyping; useful for exploration, but not the same as a governed production design system. UI Guideline’s Systems vs Kits distinction is a practical way to keep these concepts separate.
- **Progressive disclosure:** defers advanced/rarely used actions to secondary surfaces to make complex applications easier to learn and less error-prone. This is particularly important for Praxis because “flexible without becoming an everything app” requires structure in *what shows up when*.

**Non-goals (to preserve product clarity)**
- Not a full document/knowledge base system (avoid “infinite formatting” as the core).
- Not a heavyweight project management suite; collaboration should enable households and small teams without importing enterprise workflow complexity.
- Not an esoteric content app first; insights are an overlay and must earn their place by improving daily execution and reflection.

## 1. Inherited Constraints

Not Applicable.

## 2. Thesis / Scope

### Benchmark foundations and flexible visual vibe tracks

Praxis’s design research begins with two project sources:

- UI Guideline’s **benchmark design systems index** (Systems), positioned as a curated list of popular design systems/UX libraries used as benchmarks.
- UI Guideline’s **Figma UI kits index** (Kits), positioned as a curated list of acclaimed and widely used Figma kits for faster design execution.

These sources are best used as **a research index and acceleration layer**, not as something to copy.

### Flexible visual vibe tracks to keep Praxis adaptable

You have not chosen how Praxis should feel visually. Instead of forcing a single style direction, Praxis should support **multiple “vibe tracks”** that can later be narrowed. These are framed as modern, fully-understood approaches with clear implications for layout, typography, motion, and component styling.

**Vibe track: Calm, attention-respecting minimalism**
Praxis should be able to feel *quiet*, with low cognitive noise and a strong sense of “calm control.” This aligns with Calm Technology principles: technology should demand the smallest possible amount of attention, inform without distracting, and respect the user’s primary task of “being human.”

**Vibe track: Modular card-and-grid dashboards (bento-adjacent)**
Modern web apps increasingly use modular, scannable, compartmentalized layouts. Rather than anchoring on trendy labels, Praxis should anchor on enduring primitives: **cards as flexible containers** and **grid-based hierarchy**. This keeps the approach contemporary while remaining stable.

**Vibe track: Keyboard-first command center**
For desktop web, Praxis should be able to support a “power user” mode with strong keyboard shortcuts and a command palette. Command palettes have become common in complex web apps as a searchable way to reach commands and navigation quickly, and products like Linear explicitly design multiple parallel paths (buttons, menus, shortcuts, command line) so users build muscle memory.

**Vibe track: Expressive, themeable system UI**
Praxis should be able to support expressive theming across modes (light/dark, density, contrast) without breaking structure. Modern design-token-driven systems enable this by mapping “design decisions” into portable token formats and using tokens as the source of truth in design and code.

### Benchmark matrix starter (what to study, and why)

This matrix is intentionally **not prescriptive**. It’s a starter map of benchmark references that cover foundations, accessibility posture, component completeness, and documentation quality. UI Guideline’s benchmark list is the index; you then go to each system’s primary documentation for real implementation knowledge.

| Benchmark reference (from Systems list + canonical DS docs) | What it’s strong for | Praxis relevance (what you should extract) |
|---|---|---|
| Material Design 3 | Tokenized foundations and scalable theming concepts.  | Token strategy and semantic color/typography roles you can adapt without inheriting Material’s aesthetics.  |
| Atlassian Design System | Mature token program and enterprise-grade UX constraints (dense apps, complex workflows).  | Density modes, information hierarchy, and “app-scale” patterns where multiple workflows coexist.  |
| IBM Carbon | “System = code + design tools + guidance + community” framing; strong component discipline.  | Component spec rigor, governance mindset, and building blocks that scale to complex product surfaces.  |
| Fluent 2 / Fluent Web | Explicit parity across Web Components and React, positioning components as DS building blocks.  | A comparative lens for “web components vs React components” decisions later, and cross-surface consistency literacy.  |
| USWDS | Patterns + components + accessibility guidance as an integrated whole.  | End-to-end pattern documentation style (especially forms) and accessibility-first implementation defaults.  |
| Apple HIG | Clear typography and color hierarchy guidance in a human-centered framing.  | Visual hierarchy discipline and high signal-to-noise interface composition principles.  |

### UI kits strategy (exploration without lock-in)

UI Guideline’s Kits index is useful to **accelerate prototyping**, variant exploration, and layout scaffolding—especially before your Praxis tokens and components are fully settled.

**Policy: kits are allowed for prototypes, not as production truth.**
A kit can provide time-to-first-prototype speed, but production UI should be derived from Praxis tokens + component specs so you avoid “kit identity lock-in” where your product becomes a clone of its starter kit.

For the design toolchain, anchor on a workflow that supports **token variables/modes** so you can explore vibe tracks without redesigning each screen for each theme. Token interoperability is increasingly supported via a vendor-neutral token format specification (Design Tokens Format Module).

## 3. Architecture / Structure

### Information architecture and core workflows

Praxis is a multi-workflow app (daily execution + habits + goals + projects + collaboration + optional canvas). For IA, you must design around user mental models and reduce cognitive load, which means you should expect to run research methods like card sorting to validate your navigation and labels.

### Core object model (first-class objects)

Design and implementation should share a stable conceptual model:

- **Task** (unit of execution): title, status, priority, due/scheduled, recurrence (optional), project/list, tags/contexts, effort/energy estimate (optional), notes.
- **Habit** (repeating behavior): schedule rule, streak, minimum viable completion, “skip” semantics.
- **Goal** (outcome): metric or qualitative milestone, time horizon, linked habits/tasks, progress view.
- **Project** (container of tasks/goals, often collaborative): roles/permissions, shared views, comment/activity.
- **Note** (capture and reflection): daily review notes, planning notes, meeting notes.
- **Insight** (optional overlay): daily “suggestions,” prompts, and context; must be non-blocking and dismissible.

This model supports the “planner-first with freeform surface” concept by allowing canvas artifacts to be *views* of objects rather than separate data copies.

### Navigation model (web-first, mobile-first)

Because Praxis must work in desktop and mobile web, the navigation model should aim for:

- **Mobile web:** persistent bottom navigation for top-level views; one-handed primary actions; gesture-safe overlays with clear dismissal. The UX must respect WCAG target size guidance to reduce mis-taps and accidental activation.
- **Desktop web:** left sidebar + command palette + keyboard shortcuts; “today command center” view with multi-pane options (optional). Command palette provides fast navigation and actions in complex apps as a searchable command layer.
- **Progressive disclosure:** advanced features (automation, deep customization, specialized insights) should be deferred to secondary surfaces to avoid overwhelming first-time users.

### Primary workflow requirements (minimum set)

**Capture (fastest path wins)**
A user must be able to capture a task or note with minimal friction. The UI should emphasize “inbox capture” as the safe default. Progressive disclosure should keep metadata optional at capture time.

**Triage (clarify and schedule)**
Inbox triage must provide simple, consistent outcomes: schedule, assign to project, convert to habit/goal linkage, or archive. Heuristic guidance for complex applications suggests keeping workflows predictable and discoverable even when the domain is complex.

**Today (commit and do)**
The Today view should support both calm minimalism and power-user density. It must clearly show what is actionable and reduce ambiguity (visibility of system status is a core usability heuristic).

**Done and review (reflection as a first-class citizen)**
Praxis is not only about completing tasks but about closing the loop. The review experience should be lightweight and habit-forming, which makes microcopy and progressive disclosure critical to avoid “review dread.”

**Collaboration (household/team without bloat)**
Collaboration should focus on shared projects and lists, assignments, and comment/activity. Avoid importing heavyweight project workflow features until demanded by validated use cases. Heuristics for complex applications support delivering domain workflows without feature overload.

### Optional surface: canvas/whiteboard without duplication

Treat the canvas as an optional “thinking surface” that **references tasks/goals/notes**, rather than becoming a separate universe. This prevents fragmentation and keeps the main driver (tasks/habits/goals) intact.

### Design system blueprint: tokens, components, and patterns

A “Praxis design system” should be built as a **token-first, accessibility-first** system that can support the four vibe tracks without rewriting components each time.

### Token strategy (the spine)

**What tokens are:** small, reusable design decisions that replace static values with semantic names (e.g., “text.default” rather than `#111111`). Tokens are widely described as name/value pairings representing repeatable design decisions and used as a single source of truth.

**Why tokens matter for Praxis:**
- They enable theme exploration (vibe tracks) without redesigning every component.
- They reduce drift between design and implementation by making design decisions computable and portable.

**Interoperability goal:** align your token format with the Design Tokens Format Module (a specification describing a file format to exchange tokens across tools). This helps prevent a tool-vendor lock-in and keeps long-term flexibility.

**Praxis token categories (high-level, stable)**
- **Color tokens:** semantic roles (backgrounds, surfaces, borders, text, interactive states, critical/success/warning).
- **Typography tokens:** scale, weight, line-height, letter spacing, styles for headings/body/meta; focus on hierarchy and readability.
- **Spacing tokens:** an explicit spacing scale; include layout density modes (compact/comfortable) as token modes rather than one-off component hacks.
- **Radius/elevation tokens:** surface definition; keep elevation optional in calm minimal and more pronounced in dashboard/bento mode.
- **Motion tokens:** durations/easings for microinteractions; default should be subtle to align with calm principles.
- **Component tokens:** standardized heights/padding for inputs, buttons, list rows, cards; enables consistent density toggles.

### Component taxonomy (flexible but complete)

This taxonomy is structured so components can be styled differently per vibe track, while behavior remains stable.

**Foundations**
- Layout grid system (responsive; containers + breakpoints). Layout grids support hierarchy, alignment, and consistency.
- Color, typography, spacing, elevation, motion, iconography guidance.

**Primitives (accessibility-first building blocks)**
- Buttons (primary/secondary/tertiary), icon button
- Link
- Text input, textarea, select, combobox, date/time input wrapper patterns
- Checkbox, radio, switch
- Tabs, segmented control
- Tooltip, popover
- Dialog / modal
- Drawer / bottom sheet
- Toast / inline notification

Accessible component primitives are often used as a base layer for design systems precisely because they can be styled while preserving interaction and accessibility behavior.

**Navigation and command**
- App shell (mobile + desktop variants)
- Sidebar nav, bottom nav
- Breadcrumbs (for deeper project structures if necessary)
- **Command palette** (desktop-first; must support both navigation and actions)
- Global search (objects: tasks, habits, goals, projects, notes)

**Data display (core for Life OS)**
- List row (task row, habit row, goal row)
- Card (flex container and summary unit)
- Table (for power-user project views); table design should support finding, comparing, viewing/editing a row, and taking actions.
- Empty states, skeleton/loading states, error states (must be consistent across objects)

**Planning and time**
- Date/time patterns and schedule chips
- Calendar-lite views (Today timeline, Week overview)
- Recurrence editor patterns (habit/task recurrence)
- Progress indicators (goal progress, streak progress, completion rate)

**Collaboration**
- Comment thread
- Presence indicator (later)
- Assignments and mentions
- Permission surfaces and sharing patterns (simple, predictable)

**Reflection and insights**
- Daily review module (journal prompt, done summary, plan tomorrow)
- Insight cards (non-blocking suggestions, prompts) aligned to calm tech principles: inform without demanding focus, respect the user’s primary task.

**Optional canvas tooling**
- Canvas board surface (freeform)
- Node/card element that references underlying objects
- Lasso/select tools (later)
- Export/share as image/PDF (later)

### Component specification template (to prevent future ambiguity)

Every component should have a short spec that can be used both by design and engineering; Carbon explicitly frames systematic reuse of components as a path to visual and functional consistency.

Minimum component spec fields:
- Purpose and use cases
- Anatomy (subparts)
- Variants and density options
- States (default/hover/active/disabled/loading/error)
- Accessibility requirements (keyboard, focus visuals, labels)
- Content guidance (microcopy, truncation, empty state text)
- Responsive behavior (mobile vs desktop)
- Do/Don’t examples

### Web implementation considerations that influence UI/UX (without overcommitting)

Praxis is web-first; modern CSS capabilities can reduce UI inconsistency and technical debt. For example, container queries allow components to respond to container size rather than only the viewport, increasing reusability across layouts.

Praxis should also consider progressive web app behaviors (installability, offline capability) because they affect UX expectations for a “Life OS.” PWAs can be installable and can support offline operation, enabling a more app-like feel even without native apps.

## 4. Operational Rules

### Accessibility and inclusive UX requirements

Praxis should adopt **WCAG 2.2 AA** as a baseline for web accessibility because WCAG 2.2 is a W3C Recommendation and defines testable success criteria for accessibility conformance.

**Accessibility is not only compliance; it is product quality.** WCAG explicitly includes cognitive, learning, and neurological disabilities within its scope, which aligns with Praxis’s interest in ADHD-friendly patterns.

### High-impact WCAG 2.2 areas to build into Praxis from day one

**Keyboard focus visibility and non-obscuring UI**
- WCAG includes success criteria ensuring focused elements remain visible and not obscured (Focus Not Obscured), emphasizing that knowing the current focus point is critical for keyboard users.
- WCAG also defines minimum visibility requirements for focus indicators (Focus Appearance) to ensure focus is clearly discernible.

**Target size for touch and pointer inputs**
- WCAG 2.2 includes Target Size (Minimum), intended to reduce accidental activation and assist users with dexterity limitations by ensuring targets are sufficiently large or spaced.

**Accessible authentication**
- WCAG’s understanding guidance for Accessible Authentication (Minimum) frames the goal as enabling logins with less mental effort and avoiding requirements to solve/recall/transcribe as a necessary step.

**Redundant entry**
- WCAG’s redundant-entry guidance reinforces the idea of making prior entry available when appropriate, reducing cognitive load and repeated work.

### Design requirements derived from accessibility + calm technology

A Praxis UI should “inform without demanding focus,” aligned with calm tech principles and modern accessibility emphasis on predictable, recoverable interactions.

Practical requirements:
- No critical information is conveyed only by color; rely on text and iconography too (especially for errors and statuses).
- Error handling must be constructive and respectful of user effort; NN/g recommends high visibility, constructive communication, and respect for user effort in error messages.
- Use progressive disclosure to avoid overwhelming users while still supporting expert workflows.
- Ensure mobile web tap behaviors avoid surprises; target sizing and spacing reduce mis-taps.

### Microcopy and content design (high-level rules)

Microcopy often forms a large share of the text in an interface and is valued because it guides users efficiently and is easy to scan.

Praxis content rules:
- Default to “calm, non-blaming, actionable” copy in system messages; USWDS guidance emphasizes respectful voice/tone and actionable validation messaging.
- Prefer inline validation where possible, and keep error messages close to fields to support scanning and magnification users.

### Research, validation, and UX quality operations

Praxis should run a **continuous UX quality loop** rather than treating research as a one-time stage.

### Heuristic evaluation as a recurring practice

Jakob Nielsen’s 10 usability heuristics are widely used as broad rules of thumb for interaction design, updated and maintained by the Nielsen Norman Group.
NN/g also provides guidance on applying heuristics specifically to complex applications, which is directly relevant because Praxis spans multiple workflows.
NN/g further describes how to conduct heuristic evaluations as a practical method in ongoing UX work.

Operationalization:
- Run heuristic evaluation at each milestone (prototype, alpha, beta).
- Track findings in a log with severity, affected screens/components, and resolution.

### IA validation: card sorting and mental models

Card sorting is used to uncover users’ mental models of how information should be grouped and labeled, supporting an IA that matches user expectations.

Operationalization:
- Use card sorting before locking primary navigation labels (Tasks vs Inbox vs Today vs Projects vs Goals vs Habits).
- Repeat when adding major new object types or collaboration.

### Usability testing scripts tied to the Praxis core loop

Testing should focus on a small set of high-value flows aligned to the product thesis:
- Speed of capture (mobile + desktop)
- Inbox triage throughput
- Planning the day (Today view)
- Completing and reviewing (reinforce reflection)
- Habit minimum viable completion (streak preservation without shame)
- Collaboration basics: share a project/list, assign a task, comment, resolve

Progressive disclosure should be evaluated: are advanced features discoverable without overwhelming novices?

### Gamification: streaks as “quiet dopamine,” not the main loop

Streaks are psychologically powerful and can be addictive; Smashing Magazine highlights the need to align streak systems with human psychology to design them responsibly.

Praxis stance:
- Streak visuals should reinforce identity (“I’m consistent”), not guilt.
- Allow “minimum viable” completions to preserve continuity without forcing perfection.
- Ensure streak mechanics don’t incentivize meaningless task spam.

### Performance and state design as UX, not engineering-only

State design is UX-critical:
- Loading states must preserve orientation and reduce anxiety.
- Offline/poor connection experiences should degrade gracefully (especially for mobile web).
- Error states must be constructive, visible, and respectful of effort.

## 5. Scope Boundaries

Not Applicable.

## 6. Metrics (If Applicable)

Not Applicable.

## 7. Failure Modes

Not Applicable.

## 8. Anti-Features

Not Applicable.

## 9. Alignment Contracts

### Source-of-truth hierarchy

To avoid drift:
1) Tokens (semantic decisions)
2) Components (spec + behavior)
3) Patterns (end-to-end workflows)
4) Screens (assemblies of patterns)

This mirrors how mature systems describe reusability and consistency through systematic component reuse and shared guidance.

### External reference posture (how to stay flexible)

Praxis should treat reference systems as “libraries of lessons,” not as a single template:
- UI Guideline Systems for benchmark scanning.
- UI Guideline Kits for prototyping acceleration.
- Token standards work (Design Tokens Format Module) to preserve tooling flexibility.
- WCAG 2.2 AA as a baseline compliance and quality target.

---

**Referenced research anchors (named once for traceability):**  for WCAG and other web standards;  for heuristics, complexity guidance, and UX writing research;  for usability heuristics;  and  for Calm Technology;  for modern calm-tech principles framing;  for Calm Technology origins;  for recent calm-tech perspective;  as a practical ecosystem reference point for design-system workflows;,,, and  as major design-system publishers used for benchmark learning.

## 10. Governance

### Documentation structure and “living spec” boundaries

Praxis design documentation should separate:
- **Durable foundations:** token categories, component taxonomy, accessibility baseline, core flows.
- **Evolving decisions:** visual vibe choice, final token values, final component styling, gamification theme/companion design.

### Decision records (lightweight, essential)

Maintain a small UX decision record practice:
- Context
- Options considered
- Decision
- Consequences (what this enables and what it constrains)

This prevents repeated debates and makes future refactors easier.
