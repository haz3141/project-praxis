# Praxis — Enhanced Stitch-Optimized Specification

> Desktop-first productivity planner with cognitive-calm hierarchy, structured spacing rhythm, and priority-driven task visualization. Designed for 1440px–1920px viewports.

---

**DESIGN SYSTEM (REQUIRED):**

- Platform: Web, Desktop-first (1440px baseline, 1920px max)
- Theme: Light, calm-professional, cognitively restrained
- Density Modes: Comfortable (default), Compact (user-toggled)
- Accessibility: WCAG 2.2 AA compliant
- Max Reading Width: 72 characters

**Color Palette — Calm Professional (Neutral + Indigo Accent):**

- Background Surface: Snow White (#FAFAFA) — primary app background
- Elevated Surface: Pure White (#FFFFFF) — card and panel backgrounds
- Sidebar Surface: Slate-Tinted Off-White (#F5F6F8) — persistent navigation panel
- Primary Accent: Deep Indigo (#4F46E5) — priority indicators, active states, primary CTA buttons
- Primary Accent Hover: Darkened Indigo (#4338CA) — hover state for primary actions
- Secondary Accent: Muted Slate Blue (#6366F1) — secondary buttons, links, inline indicators
- Text Primary: Near-Black Charcoal (#111827) — headings, task names, high-priority content
- Text Secondary: Medium Slate Gray (#6B7280) — body text, descriptions, metadata
- Text Tertiary: Light Neutral Gray (#9CA3AF) — placeholders, captions, timestamps
- Success: Calm Forest Green (#059669) — completed states, positive feedback
- Warning: Warm Amber (#D97706) — attention indicators, approaching deadlines
- Destructive: Muted Crimson (#DC2626) — delete actions, overdue states
- Border Default: Whisper Gray (#E5E7EB) — card borders, dividers, input strokes
- Border Focus: Indigo Ring (#4F46E5 at 40% opacity) — focus ring around inputs and interactive elements
- Disabled Surface: Faded Gray (#F3F4F6) — disabled button/input backgrounds
- Disabled Text: Muted Gray (#D1D5DB) — disabled label/text color

**Grid System:**

- Columns: 12-column grid
- Max Content Width: 1280px
- Gutter Width: 24px between columns
- Outer Margin: 80px on each side at 1440px viewports
- Content Text Max Width: 72ch for readability
- Breakpoints: Primary 1440px / Secondary 1280px

**Spacing Scale (8px base unit):**

- 4px (micro — inner padding, icon gaps)
- 8px (tight — inline element spacing)
- 12px (snug — compact density padding)
- 16px (base — standard padding, input height increment)
- 24px (relaxed — section inner padding, card padding)
- 32px (loose — section gaps, form group spacing)
- 40px (spacious — major section dividers)
- 56px (wide — page section vertical rhythm)
- 72px (expansive — top-level section separators)

**Typography Scale:**

- Font Family: Inter (Google Fonts), system-ui fallback stack
- H1: 36px / 700 weight / -0.02em tracking / 44px line-height — page titles
- H2: 28px / 600 weight / -0.01em tracking / 36px line-height — section headers
- H3: 22px / 600 weight / normal tracking / 30px line-height — subsection headers, card titles
- H4: 18px / 600 weight / normal tracking / 26px line-height — group labels
- H5: 16px / 600 weight / 0.01em tracking / 24px line-height — inline headers
- H6: 14px / 600 weight / 0.02em tracking / 20px line-height — overline labels
- Body: 16px / 400 weight / normal tracking / 24px line-height — primary readable text
- Small: 14px / 400 weight / normal tracking / 20px line-height — secondary descriptions
- Caption: 12px / 400 weight / 0.01em tracking / 16px line-height — timestamps, metadata

**Elevation Model (4 levels):**

- Level 0 — Flat: No shadow, no border — flush inline content
- Level 1 — Subtle: 1px solid Border Default (#E5E7EB) — cards at rest, input fields, sidebar
- Level 2 — Lifted: 0 2px 8px rgba(0, 0, 0, 0.06) — hovered cards, dropdown menus, popovers
- Level 3 — Raised: 0 6px 18px rgba(0, 0, 0, 0.08) — modals, command palette, floating panels
- Level 4 — Overlay: 0 12px 32px rgba(0, 0, 0, 0.12) + backdrop blur — critical modal dialogs, overlays

**Interaction Tokens:**

- Hover: Background shifts to nearest lighter tint; 150ms ease-out transition
- Focus: 2px Indigo ring (#4F46E5 at 40% opacity), 2px offset, visible on all interactive elements
- Active/Pressed: Scale to 0.98 + darken background 5%; 80ms ease-in
- Disabled: 50% opacity reduction, cursor not-allowed, no hover/focus response

**Motion Tokens:**

- Duration Fast: 100ms — micro-interactions, button presses
- Duration Normal: 200ms — panel transitions, fade-ins
- Duration Slow: 350ms — modal entrances, page transitions
- Easing Default: cubic-bezier(0.4, 0, 0.2, 1) — standard movement
- Easing Enter: cubic-bezier(0, 0, 0.2, 1) — elements entering view
- Easing Exit: cubic-bezier(0.4, 0, 1, 1) — elements leaving view

**Border Radius Scale:**

- None: 0px — sharp-edged containers, table cells
- Small: 4px — badges, small tags, compact buttons
- Medium: 6px — standard buttons, inputs, cards
- Large: 8px — larger cards, modals, panels
- XLarge: 12px — hero cards, prominent containers
- Full: 9999px — pill-shaped badges, avatar circles, toggle switches

---

**LAYOUT ARCHITECTURE:**

**AppShell (3-panel desktop layout):**

1. **Collapsible Sidebar (left):** 240px expanded / 64px collapsed. Contains: app logo, primary navigation links (Today, Week, Habits, Goals, Projects, Review), quick-add task button. Sidebar Surface background (#F5F6F8). Elevation Level 1.
2. **Main Content Area (center):** Fluid width, max 1280px. Contains: page header, section headers, primary task list, content cards. Background Surface (#FAFAFA). No elevation.
3. **Utility Panel (right, contextual):** 320px width, slides in from right edge. Contains: task detail view, quick edits, property panels. Elevated Surface (#FFFFFF). Elevation Level 2.

**Top Navigation Bar:**

- Height: 56px (Comfortable) / 48px (Compact)
- Contents: breadcrumb path, search trigger (opens Command Palette), density toggle, user avatar
- Background: Elevated Surface (#FFFFFF) with bottom border (Border Default)
- Position: fixed top, spans full width above Main Content Area

---

**COMPONENT INVENTORY:**

**Priority Task Card:**
- Height: 88px (Comfortable) / 72px (Compact)
- Left accent bar: 4px width, Primary Accent (#4F46E5)
- Layout: checkbox + task title (H5 weight) + due date badge + priority indicator
- Background: Elevated Surface (#FFFFFF)
- Elevation: Level 1 at rest, Level 2 on hover
- Max visible: 1–3 cards in "Today's Priorities" section (visually emphasized)
- Hover: subtle background shift, slight elevation increase

**Standard Task Row:**
- Height: 48px (Comfortable) / 40px (Compact)
- Layout: checkbox + task name (Body weight) + optional tags + due date
- Background: transparent, alternating subtle stripe optional
- Border: bottom 1px Border Default
- Hover: background tint shift

**Habit Row:**
- Height: 44px (Comfortable) / 36px (Compact)
- Layout: habit name + 7-day dot streak (current week) + completion percentage
- Dot states: filled (Success green), empty (Border Default), today (Primary Accent ring)

**Goal Card:**
- Width: spans 4 columns (in 12-col grid)
- Layout: goal title (H4) + progress bar + milestone count + target date
- Progress bar: 4px height, Primary Accent fill
- Elevation: Level 1, Level 2 on hover
- Border Radius: Medium (6px)

**Project Card:**
- Width: spans 6 columns
- Layout: project title (H3) + description (Small text) + task count + progress indicator
- Elevation: Level 1
- Border Radius: Medium (6px)

**Today Panel:**
- Full-width header section at top of Main Content Area
- Contains: date display (H1), day-of-week, weather-neutral greeting
- Below: Priority Task Cards (1–3), then standard task list
- Visual hierarchy: large date anchors the eye, priorities float above standard list

**Week Strip:**
- Horizontal 7-day bar below Today Panel header
- Each day: abbreviated name + date number + task count indicator dot
- Current day: Primary Accent background, white text
- Adjacent days: standard text, hover reveals task count tooltip

**Review Modal:**
- Centered overlay, 640px max width
- Elevation: Level 4 with backdrop blur
- Contains: weekly summary, completed count, habit streaks, reflection text area
- Border Radius: Large (8px)

**Command Palette:**
- Centered overlay, 560px width, positioned at top-third of viewport
- Elevation: Level 3
- Contains: search input (auto-focused) + filtered result list + keyboard navigation hints
- Border Radius: Large (8px)
- Enter animation: fade-in + slide-down, Duration Normal

**Buttons:**
- Primary: Solid Primary Accent background (#4F46E5), white text, Medium radius (6px)
- Secondary: Transparent background, Primary Accent text, 1px Primary Accent border
- Ghost: Transparent background, Text Secondary color, no border, hover background shift
- Destructive: Solid Destructive background (#DC2626), white text, Medium radius
- All buttons: Height 40px (Comfortable) / 36px (Compact), horizontal padding 16px

**Input Fields:**
- Text Input: 40px height, 1px Border Default stroke, Medium radius, 12px horizontal padding
- Textarea: min-height 80px, resizable vertically
- Dropdown/Select: same dimensions as text input, chevron-down icon right-aligned
- Checkbox: 18px × 18px, Small radius (4px), Primary Accent fill when checked
- Toggle Switch: 36px × 20px, Full radius (pill), Primary Accent when on
- Date Picker: text input with calendar icon, popover calendar on interaction

**Toast Notification:**
- Position: bottom-right, 16px from edges
- Width: 360px max
- Elevation: Level 2
- Border Radius: Medium (6px)
- Auto-dismiss: 5 seconds, with progress bar indicator
- Variants: info (Indigo accent), success (Green accent), warning (Amber accent), error (Red accent)

**Inline Alert:**
- Full-width within content area, 12px vertical padding, 16px horizontal
- Left border: 4px accent color per variant
- Background: tinted variant color at 5% opacity
- Border Radius: Small (4px)

**Badge:**
- Height: 20px, horizontal padding 8px
- Border Radius: Full (pill)
- Variants: default (gray), primary (indigo), success (green), warning (amber), destructive (red)
- Typography: Caption size (12px), 500 weight

**Tooltip:**
- Background: Near-Black (#1F2937), white text
- Border Radius: Small (4px)
- Padding: 6px 10px
- Max width: 240px
- Delay: 300ms before show
- Typography: Caption size

**Progress Indicator:**
- Bar variant: 4px height, full-width, rounded-full ends
- Circular variant: 24px diameter, 3px stroke width
- Colors: Primary Accent fill on Border Default track

**Section Header:**
- Layout: section title (H2) + optional action button (Ghost style) right-aligned
- Bottom border: 1px Border Default
- Bottom margin: 24px

**Page Header:**
- Layout: page title (H1) + optional subtitle (Body, Text Secondary) + optional action buttons right-aligned
- Bottom margin: 32px

---

**DESIGN CONSTRAINTS:**

- No gamification elements (no points, no XP, no streaks with celebratory animations)
- No decorative illustrations or gratuitous iconography
- No visual noise — every element must serve function
- Fast re-entry after interruption: Today Panel always shows current state at a glance
- Cognitive calm: muted palette, generous whitespace, clear typographic hierarchy
- Structured spacing rhythm: all dimensions derived from 8px base unit
- Mood: Corporate, focused, restrained — reflects professional authority without coldness

---

💡 **Tip:** This specification is optimized for Stitch screen generation. Use the `design-md` skill to convert this into a structured DESIGN.md before generating screens.
