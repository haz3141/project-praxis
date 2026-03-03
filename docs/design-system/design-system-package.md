# Praxis Design System — Full Stitch Package

## 1. DesignSystem Object

```json
{
  "name": "praxis-calm-professional",
  "version": "1.0.0",
  "description": "Desktop-first planner design system. Cognitive calm, structured hierarchy, indigo accent.",
  "platform": "desktop",
  "baseline": "1440px",

  "grid": {
    "columns": 12,
    "columnJustification": "12 columns: maximum flexibility for 3-panel AppShell (2+7+3 split). Clean subdivision into halves, thirds, quarters, sixths. Industry standard for editorial desktop layouts.",
    "maxWidth": "1280px",
    "gutter": "24px",
    "outerMargin": "80px",
    "contentTextMaxWidth": "72ch"
  },

  "breakpoints": {
    "primary": "1440px",
    "secondary": "1280px"
  },

  "spacing": {
    "baseUnit": "8px",
    "baseUnitJustification": "8px: clean halving to 4px for micro adjustments, multiplies to common desktop dimensions (16, 24, 32, 40, 48, 56, 64, 72). Aligns with standard display density grids.",
    "scale": {
      "micro": "4px",
      "tight": "8px",
      "snug": "12px",
      "base": "16px",
      "relaxed": "24px",
      "loose": "32px",
      "spacious": "40px",
      "wide": "56px",
      "expansive": "72px"
    }
  },

  "typography": {
    "fontFamily": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    "scale": {
      "h1": { "size": "36px", "weight": 700, "tracking": "-0.02em", "lineHeight": "44px" },
      "h2": { "size": "28px", "weight": 600, "tracking": "-0.01em", "lineHeight": "36px" },
      "h3": { "size": "22px", "weight": 600, "tracking": "normal", "lineHeight": "30px" },
      "h4": { "size": "18px", "weight": 600, "tracking": "normal", "lineHeight": "26px" },
      "h5": { "size": "16px", "weight": 600, "tracking": "0.01em", "lineHeight": "24px" },
      "h6": { "size": "14px", "weight": 600, "tracking": "0.02em", "lineHeight": "20px" },
      "body": { "size": "16px", "weight": 400, "tracking": "normal", "lineHeight": "24px" },
      "small": { "size": "14px", "weight": 400, "tracking": "normal", "lineHeight": "20px" },
      "caption": { "size": "12px", "weight": 400, "tracking": "0.01em", "lineHeight": "16px" }
    }
  },

  "color": {
    "surface": {
      "background": "#FAFAFA",
      "elevated": "#FFFFFF",
      "sidebar": "#F5F6F8",
      "disabled": "#F3F4F6"
    },
    "accent": {
      "primary": "#4F46E5",
      "primaryHover": "#4338CA",
      "secondary": "#6366F1"
    },
    "text": {
      "primary": "#111827",
      "secondary": "#6B7280",
      "tertiary": "#9CA3AF",
      "disabled": "#D1D5DB"
    },
    "semantic": {
      "success": "#059669",
      "warning": "#D97706",
      "destructive": "#DC2626"
    },
    "border": {
      "default": "#E5E7EB",
      "focus": "rgba(79, 70, 229, 0.4)"
    }
  },

  "elevation": {
    "level0": { "shadow": "none", "border": "none" },
    "level1": { "shadow": "none", "border": "1px solid #E5E7EB" },
    "level2": { "shadow": "0 2px 8px rgba(0,0,0,0.06)", "border": "none" },
    "level3": { "shadow": "0 6px 18px rgba(0,0,0,0.08)", "border": "none" },
    "level4": { "shadow": "0 12px 32px rgba(0,0,0,0.12)", "border": "none", "backdropFilter": "blur(8px)" }
  },

  "interaction": {
    "hover": { "backgroundShift": "nearest lighter tint", "transition": "150ms ease-out" },
    "focus": { "ring": "2px solid rgba(79,70,229,0.4)", "offset": "2px" },
    "active": { "scale": "0.98", "backgroundDarken": "5%", "transition": "80ms ease-in" },
    "disabled": { "opacity": "0.5", "cursor": "not-allowed" }
  },

  "motion": {
    "fast": { "duration": "100ms", "easing": "ease-out" },
    "normal": { "duration": "200ms", "easing": "cubic-bezier(0.4, 0, 0.2, 1)" },
    "slow": { "duration": "350ms", "easing": "cubic-bezier(0, 0, 0.2, 1)" },
    "exit": { "duration": "200ms", "easing": "cubic-bezier(0.4, 0, 1, 1)" }
  },

  "radius": {
    "none": "0px",
    "sm": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "full": "9999px"
  },

  "density": {
    "comfortable": {
      "topNavHeight": "56px",
      "priorityCardHeight": "88px",
      "taskRowHeight": "48px",
      "habitRowHeight": "44px",
      "buttonHeight": "40px",
      "inputHeight": "40px",
      "cardPadding": "24px"
    },
    "compact": {
      "topNavHeight": "48px",
      "priorityCardHeight": "72px",
      "taskRowHeight": "40px",
      "habitRowHeight": "36px",
      "buttonHeight": "36px",
      "inputHeight": "36px",
      "cardPadding": "16px"
    }
  },

  "wcag": {
    "level": "AA",
    "standard": "2.2",
    "notes": [
      "All text meets 4.5:1 contrast ratio against its background surface",
      "Large text (H1–H2) meets 3:1 minimum",
      "Focus indicators visible on all interactive elements with 2px ring",
      "Touch/click targets minimum 24px (per WCAG 2.2 Target Size)",
      "Color is never the sole indicator of state — paired with icons/text",
      "Motion respects prefers-reduced-motion media query"
    ]
  }
}
```

---

## 2. DTCG Token JSON (W3C Design Token Community Group format)

```json
{
  "$name": "Praxis Calm Professional",
  "$description": "Desktop-first planner tokens — cognitive calm, indigo accent",

  "color": {
    "surface": {
      "background": { "$value": "#FAFAFA", "$type": "color", "$description": "App background" },
      "elevated": { "$value": "#FFFFFF", "$type": "color", "$description": "Card/panel background" },
      "sidebar": { "$value": "#F5F6F8", "$type": "color", "$description": "Sidebar background" },
      "disabled": { "$value": "#F3F4F6", "$type": "color", "$description": "Disabled element background" }
    },
    "accent": {
      "primary": { "$value": "#4F46E5", "$type": "color", "$description": "Primary action, focus, priority" },
      "primary-hover": { "$value": "#4338CA", "$type": "color", "$description": "Hover state for primary" },
      "secondary": { "$value": "#6366F1", "$type": "color", "$description": "Secondary actions, links" }
    },
    "text": {
      "primary": { "$value": "#111827", "$type": "color", "$description": "High-importance text" },
      "secondary": { "$value": "#6B7280", "$type": "color", "$description": "Body text, descriptions" },
      "tertiary": { "$value": "#9CA3AF", "$type": "color", "$description": "Placeholders, captions" },
      "disabled": { "$value": "#D1D5DB", "$type": "color", "$description": "Disabled text" }
    },
    "semantic": {
      "success": { "$value": "#059669", "$type": "color", "$description": "Completed, positive" },
      "warning": { "$value": "#D97706", "$type": "color", "$description": "Attention, deadlines" },
      "destructive": { "$value": "#DC2626", "$type": "color", "$description": "Delete, overdue" }
    },
    "border": {
      "default": { "$value": "#E5E7EB", "$type": "color", "$description": "Default borders, dividers" },
      "focus": { "$value": "rgba(79, 70, 229, 0.4)", "$type": "color", "$description": "Focus ring" }
    }
  },

  "spacing": {
    "micro": { "$value": "4px", "$type": "dimension", "$description": "Icon gaps, inner badge pad" },
    "tight": { "$value": "8px", "$type": "dimension", "$description": "Inline spacing" },
    "snug": { "$value": "12px", "$type": "dimension", "$description": "Compact density padding" },
    "base": { "$value": "16px", "$type": "dimension", "$description": "Standard padding" },
    "relaxed": { "$value": "24px", "$type": "dimension", "$description": "Card/section padding" },
    "loose": { "$value": "32px", "$type": "dimension", "$description": "Section gaps" },
    "spacious": { "$value": "40px", "$type": "dimension", "$description": "Major dividers" },
    "wide": { "$value": "56px", "$type": "dimension", "$description": "Page section rhythm" },
    "expansive": { "$value": "72px", "$type": "dimension", "$description": "Top-level separators" }
  },

  "typography": {
    "font-family": { "$value": "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", "$type": "fontFamily" },
    "h1": {
      "size": { "$value": "36px", "$type": "dimension" },
      "weight": { "$value": 700, "$type": "fontWeight" },
      "tracking": { "$value": "-0.02em", "$type": "dimension" },
      "line-height": { "$value": "44px", "$type": "dimension" }
    },
    "h2": {
      "size": { "$value": "28px", "$type": "dimension" },
      "weight": { "$value": 600, "$type": "fontWeight" },
      "tracking": { "$value": "-0.01em", "$type": "dimension" },
      "line-height": { "$value": "36px", "$type": "dimension" }
    },
    "h3": {
      "size": { "$value": "22px", "$type": "dimension" },
      "weight": { "$value": 600, "$type": "fontWeight" },
      "tracking": { "$value": "0em", "$type": "dimension" },
      "line-height": { "$value": "30px", "$type": "dimension" }
    },
    "h4": {
      "size": { "$value": "18px", "$type": "dimension" },
      "weight": { "$value": 600, "$type": "fontWeight" },
      "tracking": { "$value": "0em", "$type": "dimension" },
      "line-height": { "$value": "26px", "$type": "dimension" }
    },
    "h5": {
      "size": { "$value": "16px", "$type": "dimension" },
      "weight": { "$value": 600, "$type": "fontWeight" },
      "tracking": { "$value": "0.01em", "$type": "dimension" },
      "line-height": { "$value": "24px", "$type": "dimension" }
    },
    "h6": {
      "size": { "$value": "14px", "$type": "dimension" },
      "weight": { "$value": 600, "$type": "fontWeight" },
      "tracking": { "$value": "0.02em", "$type": "dimension" },
      "line-height": { "$value": "20px", "$type": "dimension" }
    },
    "body": {
      "size": { "$value": "16px", "$type": "dimension" },
      "weight": { "$value": 400, "$type": "fontWeight" },
      "tracking": { "$value": "0em", "$type": "dimension" },
      "line-height": { "$value": "24px", "$type": "dimension" }
    },
    "small": {
      "size": { "$value": "14px", "$type": "dimension" },
      "weight": { "$value": 400, "$type": "fontWeight" },
      "tracking": { "$value": "0em", "$type": "dimension" },
      "line-height": { "$value": "20px", "$type": "dimension" }
    },
    "caption": {
      "size": { "$value": "12px", "$type": "dimension" },
      "weight": { "$value": 400, "$type": "fontWeight" },
      "tracking": { "$value": "0.01em", "$type": "dimension" },
      "line-height": { "$value": "16px", "$type": "dimension" }
    }
  },

  "elevation": {
    "level-0": { "$value": "none", "$type": "shadow", "$description": "Flat, inline" },
    "level-1": { "$value": "0 0 0 1px #E5E7EB", "$type": "shadow", "$description": "Subtle border" },
    "level-2": { "$value": "0 2px 8px rgba(0,0,0,0.06)", "$type": "shadow", "$description": "Hovered cards" },
    "level-3": { "$value": "0 6px 18px rgba(0,0,0,0.08)", "$type": "shadow", "$description": "Modals, palettes" },
    "level-4": { "$value": "0 12px 32px rgba(0,0,0,0.12)", "$type": "shadow", "$description": "Critical overlays" }
  },

  "radius": {
    "none": { "$value": "0px", "$type": "dimension" },
    "sm": { "$value": "4px", "$type": "dimension" },
    "md": { "$value": "6px", "$type": "dimension" },
    "lg": { "$value": "8px", "$type": "dimension" },
    "xl": { "$value": "12px", "$type": "dimension" },
    "full": { "$value": "9999px", "$type": "dimension" }
  },

  "motion": {
    "duration": {
      "fast": { "$value": "100ms", "$type": "duration" },
      "normal": { "$value": "200ms", "$type": "duration" },
      "slow": { "$value": "350ms", "$type": "duration" }
    },
    "easing": {
      "default": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)", "$type": "cubicBezier" },
      "enter": { "$value": "cubic-bezier(0, 0, 0.2, 1)", "$type": "cubicBezier" },
      "exit": { "$value": "cubic-bezier(0.4, 0, 1, 1)", "$type": "cubicBezier" }
    }
  }
}
```

---

## 3. Tailwind v4 CSS Variable Mapping Strategy

Tailwind v4 uses native CSS `@theme` blocks for design token integration. All tokens map to CSS custom properties consumed directly by Tailwind's utility engine.

```css
/* praxis-tokens.css — Tailwind v4 theme layer */

@theme {
  /* ── Colors ── */
  --color-surface-background: #FAFAFA;
  --color-surface-elevated: #FFFFFF;
  --color-surface-sidebar: #F5F6F8;
  --color-surface-disabled: #F3F4F6;

  --color-accent-primary: #4F46E5;
  --color-accent-primary-hover: #4338CA;
  --color-accent-secondary: #6366F1;

  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-text-tertiary: #9CA3AF;
  --color-text-disabled: #D1D5DB;

  --color-semantic-success: #059669;
  --color-semantic-warning: #D97706;
  --color-semantic-destructive: #DC2626;

  --color-border-default: #E5E7EB;
  --color-border-focus: rgba(79, 70, 229, 0.4);

  /* ── Spacing ── */
  --spacing-micro: 4px;
  --spacing-tight: 8px;
  --spacing-snug: 12px;
  --spacing-base: 16px;
  --spacing-relaxed: 24px;
  --spacing-loose: 32px;
  --spacing-spacious: 40px;
  --spacing-wide: 56px;
  --spacing-expansive: 72px;

  /* ── Typography ── */
  --font-family-primary: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  --font-size-h1: 36px;
  --font-size-h2: 28px;
  --font-size-h3: 22px;
  --font-size-h4: 18px;
  --font-size-h5: 16px;
  --font-size-h6: 14px;
  --font-size-body: 16px;
  --font-size-small: 14px;
  --font-size-caption: 12px;

  --line-height-h1: 44px;
  --line-height-h2: 36px;
  --line-height-h3: 30px;
  --line-height-h4: 26px;
  --line-height-h5: 24px;
  --line-height-h6: 20px;
  --line-height-body: 24px;
  --line-height-small: 20px;
  --line-height-caption: 16px;

  --tracking-tight: -0.02em;
  --tracking-snug: -0.01em;
  --tracking-normal: 0em;
  --tracking-wide: 0.01em;
  --tracking-wider: 0.02em;

  /* ── Elevation ── */
  --shadow-level-0: none;
  --shadow-level-1: 0 0 0 1px #E5E7EB;
  --shadow-level-2: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-level-3: 0 6px 18px rgba(0, 0, 0, 0.08);
  --shadow-level-4: 0 12px 32px rgba(0, 0, 0, 0.12);

  /* ── Radius ── */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* ── Motion ── */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  /* ── Grid ── */
  --grid-columns: 12;
  --grid-max-width: 1280px;
  --grid-gutter: 24px;
  --grid-outer-margin: 80px;
  --content-max-width: 72ch;
}

/* ── Density Mode Variables ── */
:root,
[data-density="comfortable"] {
  --density-topnav-height: 56px;
  --density-priority-card-height: 88px;
  --density-task-row-height: 48px;
  --density-habit-row-height: 44px;
  --density-button-height: 40px;
  --density-input-height: 40px;
  --density-card-padding: 24px;
}

[data-density="compact"] {
  --density-topnav-height: 48px;
  --density-priority-card-height: 72px;
  --density-task-row-height: 40px;
  --density-habit-row-height: 36px;
  --density-button-height: 36px;
  --density-input-height: 36px;
  --density-card-padding: 16px;
}
```

**Integration:** Import `praxis-tokens.css` at the top of your main CSS file. Tailwind v4 automatically resolves `@theme` variables into its utility class system. Use classes like `bg-surface-background`, `text-text-primary`, `shadow-level-2`, `rounded-md`, or reference variables directly in custom CSS.

---

## 4. Component Sizing Table (Desktop)

| Component | Comfortable | Compact | Width | Padding H | Padding V | Radius |
|---|---|---|---|---|---|---|
| **Top Nav** | 56px H | 48px H | 100% viewport | 24px | — | none |
| **Sidebar (expanded)** | full height | full height | 240px | 16px | 16px | none |
| **Sidebar (collapsed)** | full height | full height | 64px | 8px | 16px | none |
| **Utility Panel** | full height | full height | 320px | 24px | 24px | none |
| **Priority Task Card** | 88px H | 72px H | 100% main area | 24px | 16px | 6px |
| **Standard Task Row** | 48px H | 40px H | 100% main area | 24px | — | none |
| **Habit Row** | 44px H | 36px H | 100% main area | 24px | — | none |
| **Goal Card** | auto H | auto H | 4 columns (≈387px) | 24px | 24px | 6px |
| **Project Card** | auto H | auto H | 6 columns (≈596px) | 24px | 24px | 6px |
| **Button (Primary)** | 40px H | 36px H | auto (min 88px) | 16px | — | 6px |
| **Button (Ghost)** | 40px H | 36px H | auto | 12px | — | 6px |
| **Text Input** | 40px H | 36px H | auto (min 200px) | 12px | — | 6px |
| **Textarea** | 80px min H | 80px min H | 100% container | 12px | 12px | 6px |
| **Dropdown** | 40px H | 36px H | auto (min 200px) | 12px | — | 6px |
| **Checkbox** | 18px × 18px | 18px × 18px | — | — | — | 4px |
| **Toggle Switch** | 20px H | 20px H | 36px | — | — | full |
| **Badge** | 20px H | 20px H | auto | 8px | — | full |
| **Toast** | auto H | auto H | 360px max | 16px | 12px | 6px |
| **Inline Alert** | auto H | auto H | 100% content area | 16px | 12px | 4px |
| **Tooltip** | auto H | auto H | 240px max | 10px | 6px | 4px |
| **Command Palette** | auto H | auto H | 560px | 16px | 12px | 8px |
| **Review Modal** | auto H | auto H | 640px max | 32px | 32px | 8px |
| **Section Header** | auto H | auto H | 100% main area | — | — | none |
| **Page Header** | auto H | auto H | 100% main area | — | — | none |
| **Week Strip** | 48px H | 40px H | 100% main area | 8px per cell | — | 4px |
| **Progress Bar** | 4px H | 4px H | 100% container | — | — | full |
| **Progress Circle** | 24px Ø | 24px Ø | — | — | — | full |
| **Date Picker** | 40px H (trigger) | 36px H (trigger) | auto | 12px | — | 6px |
