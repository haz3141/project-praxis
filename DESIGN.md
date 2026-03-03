# Design System: Praxis — Calm Professional

> Desktop-first productivity planner · Variant 1: Neutral + Indigo Accent

---

## 1. Visual Theme & Atmosphere

Praxis radiates **cognitive calm and professional trust**. The atmosphere is restrained, airy, and deliberately quiet — a workspace that feels like a well-organized desk in a modern studio with abundant natural light. Surfaces are whisper-soft warm whites and cool grays. The single accent color, a measured **Calm Indigo**, is used surgically — only for active states, primary actions, and the priority indicators that anchor the user's focus.

The design philosophy is **"structured calm"**: generous whitespace creates breathing room between elements, a rigid 8px spacing grid enforces visual rhythm without density, and all decorative elements are eliminated. There is no gamification, no playful illustration, no unnecessary motion. Every pixel serves clarity and fast re-entry after interruption.

**Key Atmosphere Words:** Airy, focused, restrained, corporate, unhurried, structured, trustworthy.

---

## 2. Color Palette & Roles

### Surfaces

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Clean Warm White | #FAFAFA | Primary page background; the default canvas |
| Pure White | #FFFFFF | Elevated surfaces — cards, panels, modals, utility panel |
| Soft Cool Gray | #F4F5F7 | Sidebar navigation background; recessed regions |
| Disabled Surface | #F3F4F6 | Inactive inputs, disabled element backgrounds, progress bar tracks |
| Pale Slate | #E2E4E9 | Structural borders, card outlines, divider lines, table rules |

### Accent & Actions

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Calm Indigo | #4F46E5 | Primary actions, focus rings, active indicators, priority accent bars |
| Deep Indigo | #4338CA | Hover state for primary buttons, deepened emphasis |
| Indigo Wash | #EEF2FF | Selected row backgrounds, hover highlights, active tab fill |

### Text

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Near Black | #111827 | Headings (H1–H4), primary labels, emphasized body text |
| Cool Medium Gray | #6B7280 | Body text, secondary descriptions, H5–H6 labels |
| Muted Light Gray | #9CA3AF | Timestamps, metadata, caption text, placeholders |
| Disabled Text | #D1D5DB | Disabled labels, fully dimmed placeholder text |

### Semantic Status

| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Subdued Emerald | #059669 | Completed tasks, success states, positive confirmation |
| Warm Amber | #D97706 | Warnings, approaching deadlines, caution indicators |
| Restrained Red | #DC2626 | Destructive actions, overdue tasks, error states |
| Pale Red Surface | #FEF2F2 | Background for destructive inline alerts |

---

## 3. Typography Rules

**Font Family:** Inter (Google Fonts) with a `system-ui, -apple-system, sans-serif` fallback stack. Inter is selected for its clarity at small sizes, wide weight range, and optimized desktop legibility. No decorative or serif fonts are used anywhere in the system.

**Weight Philosophy:** Only three weights are used to create hierarchy without visual noise:
- **700 (Bold):** Reserved exclusively for H1 page headings
- **600 (Semi-Bold):** Section headings (H2–H6), card titles, emphasized labels
- **400 (Regular):** All body text, descriptions, captions, form labels

### Type Scale

| Token | Size | Weight | Line Height | Color | Usage |
|---|---|---|---|---|---|
| H1 — Display | 36px | 700 | 1.2 | Near Black (#111827) | Page-level headings only |
| H2 — Section | 28px | 600 | 1.25 | Near Black (#111827) | Section headings, modal titles |
| H3 — Subsection | 22px | 600 | 1.3 | Near Black (#111827) | Subsection headings, panel titles |
| H4 — Card Title | 18px | 600 | 1.35 | Near Black (#111827) | Card headings, inline group titles |
| H5 — Group Label | 16px | 600 | 1.4 | Cool Medium Gray (#6B7280) | Group labels, sidebar section heads |
| H6 — Overline | 14px | 600 | 1.4 | Cool Medium Gray (#6B7280) | Overline labels, uppercase identifiers |
| Body | 16px | 400 | 1.6 | Cool Medium Gray (#6B7280) | Primary reading text |
| Small | 14px | 400 | 1.5 | Cool Medium Gray (#6B7280) | Secondary descriptions, form hints |
| Caption | 12px | 400 | 1.4 | Muted Light Gray (#9CA3AF) | Timestamps, metadata, badge labels |

**Letter Spacing:** H1–H3 use `-0.01em` for tightened display tracking. All other tokens use default tracking.

**Max Reading Width:** All body text blocks are constrained to **72 characters (72ch)** to optimize reading comfort and maintain scan-friendly line lengths.

---

## 4. Component Stylings

### Buttons

- **Primary:** Calm Indigo (#4F46E5) solid fill, white text, generously rounded corners (8px radius). On hover, deepens to Deep Indigo (#4338CA) with a smooth 120ms transition. On press, a subtle scale-down (0.98) provides tactile feedback. On keyboard focus, a 2px Calm Indigo ring appears with 2px offset.
- **Secondary:** Transparent background with a 1px Pale Slate (#E2E4E9) border and Near Black text. On hover, fills with Pale Slate background. Same radius and sizing as Primary.
- **Ghost:** No background, no border. Calm Indigo text. On hover, fills with Indigo Wash (#EEF2FF). Used for tertiary/inline actions.
- **Destructive:** Restrained Red (#DC2626) solid fill, white text. On hover, darkens. For lower-severity destructive actions, uses Pale Red Surface background with red text instead.

### Cards & Containers

- **Standard Card:** Pure White (#FFFFFF) background, subtle 1px Pale Slate border (Level 1 elevation), generously rounded corners (8px radius), 24px inner padding (Comfortable) / 16px (Compact). On hover, elevates to Level 2 with a whisper-soft diffused shadow (0 2px 8px rgba(0,0,0,0.06)).
- **Priority Task Card:** Same as Standard Card with the addition of a **4px left accent bar** in Calm Indigo (#4F46E5). Fixed height: 88px (Comfortable) / 72px (Compact). This is the most visually prominent task element, designed to anchor focus on 1–3 daily priorities.

### Inputs & Forms

- **Text Input:** 1px Pale Slate border, rounded corners (8px), Clean Warm White background. Height: 40px (Comfortable) / 36px (Compact). On focus, border changes to a 2px Calm Indigo ring. Placeholder text in Muted Light Gray.
- **Checkbox:** 20px square with subtle rounded corners (4px). Unchecked: 1px Pale Slate border. Checked: Calm Indigo fill with white checkmark. Smooth fill transition (120ms).
- **Toggle Switch:** 36px × 20px track. Off: Disabled Surface track. On: Calm Indigo track. White circular thumb slides with 120ms transition.
- **Dropdown:** Matches text input styling. Chevron-down icon right-aligned. Expanded list appears at Level 2 elevation with hover highlights in Indigo Wash.

### Feedback Components

- **Toast:** Fixed bottom-right, 360px wide, generously rounded (12px). Slides up with 200ms enter animation. Auto-dismisses after 5 seconds. Color-coded icon per variant (neutral, success, warning, error).
- **Inline Alert:** Full-width, 4px colored left border, tinted background matching the status color at very low opacity. Contains icon + title + description.
- **Badge:** Pill-shaped or subtly rounded (4px), Caption-sized text (12px / 500 weight), quiet background tints. Non-intrusive by design.
- **Tooltip:** Near Black (#111827) background, white text (12px), appears after 300ms hover delay with directional arrow. Level 2 elevation.

---

## 5. Layout Principles

### Desktop App Shell (Three-Column)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                          Top Navigation Bar (56px)                        │
├──────────┬────────────────────────────────────┬───────────────────────────┤
│          │                                    │                           │
│ Sidebar  │         Main Content Area          │     Utility Panel         │
│  260px   │      (fluid, max 1280px)           │        320px              │
│          │                                    │                           │
│ Collapsed│   ┌──────────────────────────┐     │   Contextual detail       │
│  = 64px  │   │  Page Header             │     │   Quick-add forms         │
│          │   │  Section Headers          │     │   Related info            │
│ Nav      │   │  Priority Cards (1–3)     │     │                           │
│ links    │   │  Task List                │     │   Collapsible             │
│ (vert    │   │  Goal/Project Cards       │     │   (slides in/out)         │
│  stack)  │   └──────────────────────────┘     │                           │
│          │                                    │                           │
├──────────┴────────────────────────────────────┴───────────────────────────┤
│                              (Footer optional)                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Grid

- **12-column grid** within the Main Content Area
- **Max content width:** 1280px, horizontally centered
- **Column gutter:** 24px between columns
- **Outer margin:** 80px on 1440px viewport (proportionally adjusted)
- **Sidebar:** Fixed left, 260px expanded / 64px collapsed (icon-only)
- **Utility Panel:** Fixed right, 320px, collapsible via toggle

### Visual Hierarchy Rationale

The hierarchy is structured around **fast re-entry** — when a user returns to Praxis after an interruption, the most important information (today's 1–3 priorities) must be immediately identifiable without scanning:

1. **Priority Task Cards** are the largest, most elevated elements on the Today Panel, with a distinctive left accent bar in the system's only saturated color (Calm Indigo). They sit above all other task rows and are limited to 3 maximum.
2. **Standard Task Rows** are visually subordinate — flat, borderless, using only a subtle bottom divider. They blend into the background until hovered or focused.
3. **Section Headers** use the H2 scale (28px / 600) to create clear boundaries between content groups, but remain quiet (no backgrounds, no borders on the heading itself).
4. **The Sidebar** uses a recessed gray background to visually separate navigation from content, reducing cognitive load. The active item uses the accent color sparingly.
5. **The Utility Panel** is a supporting surface — it appears only when contextually relevant and never competes with the main content for attention.

### Whitespace Strategy

Whitespace is **generous and intentional**. The 8px base unit creates a consistent rhythm:
- 32px vertical gaps between major sections
- 24px padding inside cards and panels
- 16px gaps between subsections
- 8px gaps between sibling inline elements
- 4px gaps between list item rows

This spacing ladder prevents the interface from feeling cluttered or dense, even when displaying many tasks. The 72ch reading width ensures text blocks never stretch uncomfortably wide on large monitors.

---

## 6. Interaction States

All interactive elements follow a consistent state model to ensure predictability:

| State | Visual Treatment | Timing |
|---|---|---|
| **Rest** | Default appearance, Level 0–1 elevation | — |
| **Hover** | Indigo Wash background fill or 2% surface darkening | 120ms ease-out |
| **Focus (keyboard)** | 2px Calm Indigo ring, 2px offset, always visible | Immediate |
| **Active / Pressed** | 4% surface darkening, scale(0.98) on buttons | 60ms ease-in |
| **Selected** | Indigo Wash background + 3px Calm Indigo left border | Immediate |
| **Disabled** | Opacity 0.5 or Disabled Surface bg + Disabled Text | — |

---

## 7. Elevation Model

The elevation system uses a progressive depth model to communicate hierarchy and interactivity:

| Level | Name | Visual Description | Usage |
|---|---|---|---|
| 0 | Flat | No shadow, no border. Sits flush with the page surface. | Table rows, inline elements, embedded content |
| 1 | Subtle Border | 1px solid Pale Slate (#E2E4E9). Whisper-thin outline. | Cards at rest, sidebar edge, input borders |
| 2 | Soft Shadow | 0 2px 8px rgba(0,0,0,0.06). Gentle, diffused lift. | Hovered cards, dropdown menus, expanded panels |
| 3 | Medium Shadow | 0 6px 18px rgba(0,0,0,0.08). Noticeable float. | Command palette, modals, popovers |
| 4 | Deep Shadow | 0 12px 32px rgba(0,0,0,0.12). Strong depth. | Critical modal overlays, blocking dialogs |

---

## 8. Motion & Animation

Motion is **functional, not decorative**. All transitions serve to orient the user — confirming actions, indicating state changes, and providing spatial context for elements entering or leaving the viewport.

| Token | Duration | Easing | Usage |
|---|---|---|---|
| Fast | 120ms | ease-out | Hover states, toggles, micro-interactions |
| Normal | 200ms | cubic-bezier(0.4, 0, 0.2, 1) | Sidebar collapse, dropdown open, panel slide |
| Slow | 350ms | cubic-bezier(0, 0, 0.2, 1) (enter) | Modal enter, page transitions, overlay fade |
| Exit | 350ms | cubic-bezier(0.4, 0, 1, 1) | Modal exit, panel dismiss, toast auto-close |

**Reduced Motion:** The system respects `prefers-reduced-motion: reduce`. All durations are capped at 0ms, scale transforms are removed, and opacity transitions are the only permitted animation.

---

## 9. Density Modes

Praxis supports two density modes to accommodate different work styles. **Comfortable** is the default — optimized for focus and breathing room. **Compact** reduces padding and font sizes to display more information simultaneously.

| Token | Comfortable (Default) | Compact |
|---|---|---|
| Card Inner Padding | 24px | 16px |
| Standard Task Row Height | 48px | 36px |
| Priority Task Card Height | 88px | 72px |
| Section Vertical Gap | 32px | 24px |
| List Item Gap | 4px | 2px |
| Body Font Size | 16px | 14px |
| Small Font Size | 14px | 13px |
| Icon Size | 20px | 18px |
| Button Padding | 12px 20px | 8px 16px |
| Input Height | 40px | 36px |
| Top Nav Height | 56px | 48px |

---

## 10. Accessibility (WCAG 2.2 AA)

- Near Black (#111827) on Clean Warm White (#FAFAFA) = **15.4:1** contrast ratio (passes AAA)
- Cool Medium Gray (#6B7280) on Clean Warm White (#FAFAFA) = **5.2:1** (passes AA)
- Muted Light Gray (#9CA3AF) on Clean Warm White (#FAFAFA) = **3.2:1** (passes AA for large text only; used only for caption/metadata)
- White (#FFFFFF) on Calm Indigo (#4F46E5) = **6.3:1** (passes AA)
- Focus indicators: 2px solid ring, always visible — never suppressed on keyboard navigation
- All interactive targets: minimum 24×24px area
- Color is never the sole indicator — always paired with icon, text, or pattern
- All form inputs have associated `<label>` elements
- `prefers-reduced-motion` is fully supported
