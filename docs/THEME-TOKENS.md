# Theme Token Design — Ora UI

A reference for the semantic CSS variable token system used across Ora UI components. Tokens are defined as CSS variables and consumed via Tailwind utilities (`bg-`, `border-`, `text-`). The prefix is Tailwind's — the token is the name after it.

---

## Design Principles

- **Semantic over numeric** — tokens express intent, not a scale position. No step-1-through-12 cognitive overhead.
- **Guessable by convention** — given a context, there should be an obvious token to reach for. Ambiguity is a consistency bug.
- **Minimal surface area** — only add a token when it removes real ambiguity. Optionality without justification is noise.
- **Gray by default** — all tokens resolve to gray values. Accent and brand colors are applied at the component level per variant; the token system doesn't encode them.
- **States on backgrounds, not borders** — interactive state changes are expressed through background tokens. Border color stays static.

---

## Two Domains

### Layout

Page and template-level surfaces — the app shell, section backgrounds, sidebars. Also the home for **non-interactive component surfaces** like cards and panels, which share the same visual layer as layout sections.

### UI

Interactive component backgrounds and their derived states. Covers buttons, inputs, and any element where a background signals interactivity. Also includes elevated floating surfaces (overlays), component-level borders, and focus ring tokens.

There is intentional crossover at the edges — the distinction is a guide, not a hard rule.

---

## Tokens

### Layout

| Token    | Tailwind      | Role                                                          |
| -------- | ------------- | ------------------------------------------------------------- |
| `app`    | `bg-app`      | Page canvas — least contrasted, the base everything sits on   |
| `subtle` | `bg-subtle`   | One step above app — layout sections, cards, panels, sidebars |
| `line`   | `border-line` | Separators and borders on non-interactive elements            |

### UI

| Token         | Tailwind              | Role                                                                                                                                      |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `ui`          | `bg-ui`               | Interactive element background — button `surface` and `soft` variants                                                                     |
| `ui-hover`    | `bg-ui-hover`         | Hover state for interactive elements                                                                                                      |
| `ui-active`   | `bg-ui-active`        | Active/pressed state for interactive elements                                                                                             |
| `solid`       | `bg-solid`            | High-contrast neutral fill — most contrasted value (e.g. gray-950 on light, gray-50 on dark). Used for solid variant buttons and similar. |
| `overlay`     | `bg-overlay`          | Floating surfaces — dropdown content, dialog content, popovers. Non-interactive; purely a surface token.                                  |
| `line-ui`     | `border-line-ui`      | Borders on interactive components — input outlines, button borders (surface/outline variants)                                             |
| `focus`       | `outline-focus`       | Focus ring color for interactive components                                                                                               |
| `focus-solid` | `outline-focus-solid` | Focus ring color for solid variant components (inverted — e.g. gray-950 on light)                                                         |

### Text

| Token            | Tailwind         | Role                                                                                        |
| ---------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `text-primary`   | `text-primary`   | Primary text — default body and heading color                                               |
| `text-secondary` | `text-secondary` | Secondary text — supporting labels, captions, metadata                                      |
| `text-solid`     | `text-solid`     | Text on solid backgrounds — inverted from `solid` (e.g. gray-50 on light, gray-950 on dark) |

---

## Button Variant Reference

A concrete example of how tokens map to a single component:

| Variant   | Background | Border           | Text           | Focus                 |
| --------- | ---------- | ---------------- | -------------- | --------------------- |
| `solid`   | `bg-solid` | —                | `text-solid`   | `outline-focus-solid` |
| `surface` | `bg-ui`    | `border-line-ui` | `text-primary` | `outline-focus`       |
| `soft`    | `bg-ui`    | —                | `text-primary` | `outline-focus`       |
| `outline` | —          | `border-line-ui` | `text-primary` | `outline-focus`       |
| `ghost`   | —          | —                | `text-primary` | `outline-focus`       |

All interactive variants use `bg-ui-hover` and `bg-ui-active` for state changes (where applicable).

---

## CSS Variable Convention

```css
:root {
  /* Layout */
  --color-app: ...;
  --color-subtle: ...;
  --color-line: ...;

  /* UI */
  --color-ui: ...;
  --color-ui-hover: ...;
  --color-ui-active: ...;
  --color-solid: ...;
  --color-overlay: ...;
  --color-line-ui: ...;
  --color-focus: ...;
  --color-focus-solid: ...;

  /* Text */
  --color-text-primary: ...;
  --color-text-secondary: ...;
  --color-text-solid: ...;
}
```

In Tailwind v4, these map via `@theme` so utilities like `bg-ui`, `border-line`, and `text-primary` resolve directly to the CSS variables.

---

## Open Questions

- **`text-muted`** — a third text tier for disabled/placeholder text. Deferred; may be handled with opacity (`text-secondary/50`) rather than a dedicated token. To revisit once more components are built.
- **`line` naming** — provisional. Validate in practice; revisit if it doesn't feel intuitive.
