# Theme Token Design — Ora UI

A reference for the semantic CSS variable token system used across Ora UI components. Tokens are defined as CSS variables and consumed via Tailwind utilities (`bg-`, `border-`, `text-`). The prefix is Tailwind's — the token is the name after it.

---

## Design Principles

- **Semantic over numeric** — tokens express intent, not a scale position. No step-1-through-12 cognitive overhead.
- **Guessable by convention** — given a context, there should be an obvious token to reach for. Ambiguity is a consistency bug.
- **Minimal surface area** — only add a token when it removes real ambiguity. Optionality without justification is noise.
- **Gray by default** — all tokens resolve to gray values. Accent and brand colors are applied at the component level per variant; the token system doesn't encode them.
- **Backgrounds are interactive, borders are not** — interactive state changes are expressed through background tokens only. Line/border color stays static. This is a convention, not a guideline.
- **Max two levels** — token names are capped at one qualifier (e.g. `background-subtle`, `line-ui`). Compound qualifiers like `background-ui-hover` signal a need to revisit the system, not add a token.

---

## Domains

### Background

Page and component surfaces. Three tiers cover the range from page canvas to interactive component fill, plus two special-purpose surfaces: `background-solid` for high-contrast fills and `background-overlay` for floating surfaces.

### Line

Separators and borders. Three tiers cover the range from subtle layout dividers to component-level borders.

### Foreground

Text and icon color. Two tiers for primary/secondary hierarchy, plus `foreground-solid` for text on inverted surfaces.

### Interactive States

`hover` and `active` are standalone tokens, not namespaced under a domain. They are background values **by convention** — applied as `bg-hover` and `bg-active` only. Never use them for border or text color.

`active` also covers pressed and selected states.

---

## Tokens

### Background

| Token                | Tailwind                | Role                                                              |
| -------------------- | ----------------------- | ----------------------------------------------------------------- |
| `background`         | `bg-background`         | Page canvas — least contrasted, the base everything sits on       |
| `background-subtle`  | `bg-background-subtle`  | One step above base — layout sections, cards, panels, sidebars    |
| `background-ui`      | `bg-background-ui`      | Interactive component fill — button `surface` and `soft` variants |
| `background-solid`   | `bg-background-solid`   | High-contrast neutral fill — `solid` variant buttons and similar  |
| `background-overlay` | `bg-background-overlay` | Floating surfaces — dropdowns, dialogs, popovers                  |

### Interactive States

| Token    | Tailwind    | Role                                                        |
| -------- | ----------- | ----------------------------------------------------------- |
| `hover`  | `bg-hover`  | Hover state for interactive elements                        |
| `active` | `bg-active` | Active, pressed, or selected state for interactive elements |

### Line

| Token         | Tailwind             | Role                                                               |
| ------------- | -------------------- | ------------------------------------------------------------------ |
| `line`        | `border-line`        | Separators and borders on non-interactive elements                 |
| `line-subtle` | `border-line-subtle` | Lighter separator — for dividers that need less visual weight      |
| `line-ui`     | `border-line-ui`     | Borders on interactive components — input outlines, button borders |

### Foreground

| Token               | Tailwind                 | Role                                                                 |
| ------------------- | ------------------------ | -------------------------------------------------------------------- |
| `foreground`        | `text-foreground`        | Primary text — default body and heading color                        |
| `foreground-subtle` | `text-foreground-subtle` | Secondary text — supporting labels, captions, metadata               |
| `foreground-solid`  | `text-foreground-solid`  | Text on solid backgrounds — always the inverse of `background-solid` |

### Focus

| Token         | Tailwind              | Role                                          |
| ------------- | --------------------- | --------------------------------------------- |
| `focus`       | `outline-focus`       | Focus ring color for interactive components   |
| `focus-solid` | `outline-focus-solid` | Focus ring color for solid-variant components |

---

## Conventions

### Interactive state tokens are background-only

`hover` and `active` are always applied as `bg-hover` and `bg-active`. When an interactive component needs a different text color on hover, use a foreground token directly in the variant style — e.g. `hover:text-foreground`. This keeps interactive behaviour predictable across components: state changes live in one property.

### Text color shifts on hover are inline

When a component shifts text color on hover (e.g. `foreground-subtle` → `foreground` on a ghost button), this is expressed directly in the variant style — not via a token. This is expected and not considered repetition worth abstracting.

### Borders don't change on interaction

Line tokens are static. If a component has an interactive border treatment, that's a design exception worth calling out explicitly — not something the token system should encode.

### Two-level maximum

Token names have at most one qualifier. If you find yourself reaching for something like `background-ui-hover`, the token hierarchy needs adjustment — not a deeper token.

---

## Button Variant Reference

| Variant   | Background            | Border           | Text                     | Focus                 |
| --------- | --------------------- | ---------------- | ------------------------ | --------------------- |
| `solid`   | `bg-background-solid` | —                | `text-foreground-solid`  | `outline-focus-solid` |
| `surface` | `bg-background-ui`    | `border-line-ui` | `text-foreground-subtle` | `outline-focus`       |
| `soft`    | `bg-background-ui`    | —                | `text-foreground-subtle` | `outline-focus`       |
| `outline` | —                     | `border-line-ui` | `text-foreground-subtle` | `outline-focus`       |
| `ghost`   | —                     | —                | `text-foreground-subtle` | `outline-focus`       |

All interactive variants use `bg-hover` and `bg-active` for state changes (where applicable).

---

## CSS Variable Convention

```css
:root {
  /* Background */
  --background: ...;
  --background-subtle: ...;
  --background-ui: ...;
  --background-solid: ...;
  --background-overlay: ...;

  /* Interactive states */
  --hover: ...;
  --active: ...;

  /* Line */
  --line: ...;
  --line-subtle: ...;
  --line-ui: ...;

  /* Foreground */
  --foreground: ...;
  --foreground-subtle: ...;
  --foreground-solid: ...;

  /* Focus */
  --focus: ...;
  --focus-solid: ...;
}
```

In Tailwind v4, these map via `@theme` so utilities like `bg-background-ui`, `border-line`, and `text-foreground` resolve directly to the CSS variables.

---

## Open Questions

- **`line-subtle` stability** — added to resolve the toggle-group border gap. Treat as provisional until validated across more components.
- **`hover` lightness** — the gap between `hover` and `active` may be too wide. Consider pulling `hover` down slightly in lightness (making it a touch darker/more contrasted) while leaving `active` unchanged. Goal is a more perceptible step between the two states without touching the active value.
- **`line-ui` value** — gray-600 reads as too bright for component borders. Candidates are gray-400 or gray-500. Needs evaluation across inputs and buttons before landing on a value.
