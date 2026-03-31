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
--surface-1    /* panels, sidebars */
--surface-2    /* cards, inset sections */
```

Surfaces give consumers a way to establish visual hierarchy above the page background. Two levels defined upfront — a third added if a concrete need arises.

**Current values:**

```css
:root {
  --background: var(--gray-base);
  --surface-1: var(--gray-50);
  --surface-2: var(--gray-100);
}
```

---

### Interactive States

#### Ghost / default

```css
--hover: var(--gray-a200) --active: var(--gray-a300);
```

#### Outline / surface variants

Components with visible chrome at rest use softer states — the border/background already signals interactability.

```css
--hover-ui:  /* ~50% of --hover  — to be defined as fixed alpha */ --active-ui:
  /* ~75% of --active — to be defined as fixed alpha */
  --line-ui: /* border at 65% weight for outline/surface resting state */;
```

#### Colored variants

Each color (`accent`, `success`, `warning`, `destructive`) has `a100`, `a200`, `a300` alpha steps in `colors.css`.

- `a100` → component resting background
- `a200` → hover
- `a300` → active

---

### Lines

```css
--line-subtle   /* decorative separators */
--line          /* standard dividers */
--line-ui       /* interactive component borders */
```

---

### Foreground

```css
--foreground          /* primary text */
--foreground-subtle   /* secondary/muted text */
--foreground-solid    /* text on solid/filled backgrounds */
```

Foreground tokens are solid, not alpha — text contrast must be guaranteed.

---

### Focus

```css
--focus         /* focus ring on standard backgrounds */
--focus-solid   /* focus ring on solid/filled backgrounds */
```

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

## Open Questions

- Exact alpha values for `--hover-ui` and `--active-ui` — currently applied as `/50` and `/75` in components, need to be fixed as tokens.
- Whether a third surface level is needed — deferred until a concrete use case arises.
