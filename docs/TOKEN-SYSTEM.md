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

## Open Questions

- Exact alpha values for `--hover-ui` and `--active-ui` — currently applied as `/50` and `/75` in components, need to be fixed as tokens.
- Whether a third surface level is needed — deferred until a concrete use case arises.
