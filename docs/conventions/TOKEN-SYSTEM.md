# Token System

Reference for the Ora token architecture. Update as the system evolves.

---

## Philosophy

- Tokens express intent, not scale position.
- Tokens resolve to the same level of visual contrast in both light and dark mode. Mode-specific behavior belongs in components.
- Alpha values for interactive states so they adapt to any surface.
- Define the fewest tokens that cover real use cases.

---

## Domains

### Background & Surfaces

```css
--background   /* page/app floor */
--surface      /* panels, sidebars, elevated containers */
--overlay      /* modals, popovers, floating elements */
--ui           /* component backgrounds (alpha-based for layering) */
```

Surfaces establish visual hierarchy. `--ui` is alpha-based so it adapts to any background surface.

**Current values:**

```css
:root {
  --background: oklch(0.985 0 0);
  --surface: oklch(0.97 0 0);
  --overlay: oklch(0.985 0 0);
  --ui: oklch(0 0 0 / 0.059);
}
```

---

### Interactive States

Interactive state tokens use alpha values so they work on any background.

```css
--ui           /* component resting background */
--hover        /* hover state background */
--active       /* active/pressed state background */
--fill         /* solid filled backgrounds (buttons, badges) */
```

**Current values:**

```css
:root {
  --ui: oklch(0 0 0 / 0.059);
  --hover: oklch(0 0 0 / 0.091);
  --active: oklch(0 0 0 / 0.123);
  --fill: oklch(0.14 0 0);
}
```

**Component-scoped gradients:**

Variants can have gradients applied via CSS using `[data-slot]` and `[data-variant]` selectors. These layer on top of the semantic token backgrounds:

```css
[data-slot='button'][data-variant='soft'] {
  background-color: transparent;
  background-image: linear-gradient(
    to top,
    color-mix(in oklch, var(--ui) 100%, transparent),
    color-mix(in oklch, var(--ui) 50%, transparent)
  );
}
```

Inputs use the same tokens but without interaction gradients (static background only).

---

### Lines

```css
--line          /* standard dividers, solid */
--line-subtle   /* decorative separators, lighter */
--line-ui       /* interactive component borders (alpha-based) */
```

**Current values:**

```css
:root {
  --line: oklch(0.925 0 0);
  --line-subtle: oklch(0.945 0 0);
  --line-ui: oklch(0 0 0 / 0.112);
}
```

---

### Foreground

```css
--primary      /* primary text */
--secondary    /* secondary/muted text */
--muted        /* tertiary/disabled text */
--disabled     /* disabled state text */
--on-fill      /* text on solid/filled backgrounds */
--ui-label     /* component label text (theme-aware) */
```

Foreground tokens are solid (not alpha) to guarantee contrast. `--ui-label` adapts per theme via `[data-theme]` selectors.

**Current values:**

```css
:root {
  --primary: oklch(0.07 0 0);
  --secondary: oklch(0.45 0 0);
  --muted: oklch(0.556 0 0);
  --disabled: oklch(0.7 0 0);
  --on-fill: oklch(0.985 0 0);
}
```

---

### Focus

```css
--focus         /* focus ring on standard backgrounds */
--focus-fill    /* focus ring on solid/filled backgrounds */
```

**Current values:**

```css
:root {
  --focus: oklch(0.85 0 0);
  --focus-fill: oklch(0.35 0 0);
}
```

---

### Theme Palettes

Each theme (accent, destructive) defines a full palette of semantic tokens:

```css
/* Accent palette */
--accent-ui           /* component backgrounds */
--accent-fill         /* solid fills */
--accent-hover        /* hover state */
--accent-active       /* active state */
--accent-focus        /* focus ring */
--accent-focus-fill   /* focus ring on fills */
--accent-line-ui      /* borders */
--accent-secondary    /* secondary text */
--accent-primary      /* primary text */
--accent-on-fill      /* text on fills */
```

When `data-theme="accent"` is set, the base tokens (`--ui`, `--fill`, etc.) are remapped to the accent variants:

```css
[data-theme='accent'] {
  --ui: var(--accent-ui);
  --fill: var(--accent-fill);
  --hover: var(--accent-hover);
  /* ... */
}
```

This allows components to use semantic tokens everywhere while automatically adapting to the current theme.

---

## Radius

### Architecture

Radius tokens enable a UI that moves uniformly in response to a single
dynamic value — `--radius`. Changing this one property reshapes every
component that subscribes to it, giving end users full control over the
feel of their interface with no per-component work.

The system has three layers:

1. **Dynamic** — `--radius-dynamic` reads `var(--radius)` directly.
   Components that should fully conform to the user's chosen radius use
   this token (e.g., buttons, inputs).
2. **Clamped scale** — a set of predefined tokens that derive from
   `--radius` but are clamped to fixed maximums via `min()`. These move
   proportionally with the dynamic value at low radii but cap out at
   sensible limits, keeping containers, cards, and overlay content from
   becoming excessively rounded.
3. **Fixed** — `--radius-full` is always `9999px`. Components whose
   shape is intrinsic to their identity (e.g., radio buttons, avatars)
   use this and never change.

### Tokens

```css
--radius-dynamic: var(--radius); /* unclamped */
--radius-xs: min(calc(var(--radius) * 0.4), 4px); /* cap 4px  */
--radius-sm: min(calc(var(--radius) * 0.6), 6px); /* cap 6px  */
--radius-md: min(var(--radius), 10px); /* cap 10px */
--radius-lg: min(calc(var(--radius) * 1.2), 16px); /* cap 16px */
--radius-xl: min(calc(var(--radius) * 1.6), 24px); /* cap 24px */
--radius-full: 9999px; /* fixed    */
```

Each clamped token scales proportionally with `--radius` until it hits
its ceiling. This means the entire scale compresses and expands
together — at low values everything looks sharp, at high values
containers plateau while buttons and inputs keep rounding.

### When to use which

| Token              | Use case                                    | Examples                        |
| ------------------ | ------------------------------------------- | ------------------------------- |
| `rounded-dynamic`  | Interactive elements that fully conform     | Button, Input                   |
| `rounded-sm/md/lg` | Containers and overlays that need restraint | Card, Dialog, Popover, Dropdown |
| `rounded-full`     | Elements with an inherently circular shape  | Radio                           |
| `rounded-xs`       | Subtle rounding on small, dense elements    | Badge, Tag                      |

### Tailwind usage

The tokens integrate with Tailwind via the `@theme inline` block.
Components use standard Tailwind radius utilities that resolve to the
token values:

```tsx
// Dynamic — follows --radius exactly
className = 'rounded-dynamic';

// Clamped — uses the scale
className = 'rounded-md';

// Fixed — always pill-shaped
className = 'rounded-full';
```

---

## Performance Contract

Tokens are designed for **static or infrequent changes** — set a value and
leave it. Changing a `:root`-scoped token triggers a style recalculation
across every element that subscribes to it.

- **Do not animate or continuously toggle root-scoped tokens.** Putting
  `--radius` on a `transition`, `requestAnimationFrame` loop, or
  `mousemove` handler causes a full-tree recalculation per frame.
- **Color token reassignment (e.g. mode switching) is fine** — it's a
  single, infrequent recalculation that browsers handle well.
- **Radius tokens carry higher cost** than color tokens due to `calc()` /
  `min()` in the chain. Treat them as static in production.

The dynamic variable chain is a **development-time affordance** — useful for
exploring how the UI looks at different configurations. For production, set
your values once and leave them.

---

## Open Questions

- Whether additional surface levels are needed — deferred until concrete use cases arise.
- Whether to add more theme palettes (success, warning, info) or keep minimal set.
