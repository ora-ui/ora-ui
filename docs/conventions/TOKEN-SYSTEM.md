# Token System

Reference for the Ora token architecture. Update as the system evolves.

---

## Philosophy

- Tokens express intent, not scale position.
- Tokens resolve to the same level of visual contrast in both light and
  dark mode. Mode-specific behavior belongs in components.
- Alpha values for interactive surfaces so they adapt to any background.
- Define the fewest tokens that cover real use cases.

---

## Three-tier model

Tokens live in three tiers. Each tier has a distinct job and a distinct
contract with the tier above it.

1. **Scale (palette)** — palette steps per hue (`--gray-*`,
   `--accent-*`). Pure values, no intent. A theme _is_ a scale
   implementation: it provides the step values.

2. **Semantic layer** — a small, fixed-shape set of named roles
   (18 tokens), mapped onto scale steps. **This is what components
   read.** Components never reference the scale directly. Themes
   reimplement this layer to swap aesthetics; the role names and their
   intent stay constant.

3. **Component vars** — opt-in, per-component CSS custom properties for
   expression the semantic layer doesn't cover (shadows, blurs,
   decoration). Default to semantic roles; override in isolation. See
   [Component interface — CSS custom properties](INDEX.md#css-custom-properties).

The semantic layer is the contract everything else is built around:
components read it, themes implement it, and the 18-token shape is fixed
so every theme covers the same slots. See
[ADR-0008](../adr/0008-interim-role-layer-for-tokens.md) for the
decision record.

---

## Domains

The 18 semantic tokens group into six domains.

### Background & Surfaces

```css
--background   /* page/app floor */
--surface-1    /* subtle raised container */
--surface-2    /* more raised */
--surface-3    /* most raised */
--overlay      /* modals, popovers, floating elements */
```

`--surface-N` is an ordinal ladder: 1 is the most subtle raise, 3 the
most raised. `--overlay` is distinct from the surface ladder — it
matches `--background` in light mode and steps up to the first solid
surface in dark mode, so floating elements read correctly against the
page in both.

### UI

Soft interactive container backgrounds. Alpha-based so they layer over
any surface, in three strength levels.

```css
--ui-1   /* resting soft container */
--ui-2   /* one step stronger */
--ui-3   /* strongest */
```

A component maps interaction states onto these levels by visual intent,
not by a fixed state→token rule (see
[Naming convention](#naming-convention-ordinal-strength-not-interaction-state)).

### Solid

Emphatic fill, for solid buttons, badges, and similar high-emphasis
surfaces. Two strength levels.

```css
--solid-1   /* resting solid fill */
--solid-2   /* stronger solid fill */
```

Hover/active modulation on a solid surface is done with alpha against
`--solid-2`, not with additional tokens.

### Borders

Two kinds, and the value type _is_ the distinction.

```css
--separator   /* layout/structural lines — solid */
--border-1    /* ui-element border — alpha */
--border-2    /* stronger ui-element border — alpha */
```

- `--separator` is **solid**. Use it for layout/structural lines:
  between sections, panel edges, table rows. These belong to the page
  chrome and don't tint with theme.
- `--border-N` are **alpha**. Use them for interactive ui-element
  borders: inputs, outline buttons, hairlines on themed surfaces. They
  tint correctly when an ancestor sets `data-theme`.

### Outline

```css
--ring   /* focus ring and decorative outlines */
```

One value covers both standard and solid backgrounds — `outline-offset`
handles the difference, so there's no separate on-solid ring token.

### Foreground

Text and icon fills. All four foreground roles live here — the
contextual companions (`--ui-label`, `--on-solid`) are foreground
values used in the same situations as the text tiers, so they belong in
Foreground rather than under their paired surface domain.

```css
--primary     /* first-tier text/icon */
--secondary   /* second-tier text/icon */
--ui-label    /* foreground when painting on a --ui-N surface */
--on-solid    /* foreground when painting on a --solid-N surface */
```

`--primary` / `--secondary` are the two-tier hierarchy. `--ui-label`
and `--on-solid` are contextual — reach for them when the surface
underneath is a ui or solid token respectively. All four remap honestly
under `[data-theme]`.

---

## Naming convention: ordinal strength, not interaction state

Tokens in a strength ladder (`--ui-N`, `--solid-N`, `--surface-N`,
`--border-N`) are named by **intensity**, not by the interaction state
they "belong to". A component maps any interaction state to any strength
level based on visual intent.

```tsx
// Button: default mapping — hover steps up one, active steps up two
'bg-ui-1 hover:bg-ui-2 active:bg-ui-3';

// Toggle: pressed wants the hover weight, not a deeper one
'data-[pressed]:bg-ui-2';

// Tabs: selected wants the strongest weight this component has
'data-[selected]:bg-ui-3';
```

The strength ladder is the contract; the state→strength mapping is a
component decision. This is the explicit fix for the old `active/75`,
`hover/50` escape-hatch family, where alpha was used to wrong-name a
tone into a different state.

---

## Escape hatches: alpha modifiers

Components may use alpha modifiers (`bg-ui-1/50`, `bg-ui-2/50`,
`border-border-1/80`) for **subtle contextual modulation of the same
role**. This is sanctioned, not a smell.

The canonical case: a surface button variant has a border, so its
container fill wants slightly less weight than a soft button's container
fill — same role, contextually softer. Adding a fourth strength level
for "border-compensated" would inflate the contract; alpha modulation is
honest.

The line between sanctioned modulation and a missing token is **intent**:

- **Sanctioned** — same role, contextually softer/stronger because of
  an adjacent affordance.
- **Missing token** — reaching for a value that conceptually wants its
  own name. (The old `bg-fill/90` for solid-button hover was this; the
  fix was to add `--solid-2`, not normalise the hack.)

Reviewers call out ambiguous cases during PR review.

---

## Theme remapping

`[data-theme="X"]` remaps the semantic layer onto a themed scale.
Components read semantic roles everywhere and automatically adapt to the
current theme — no runtime style calculation, no per-component theme
code.

```css
/* Default (gray) theme — no attribute needed */
:root {
  --ui-1: /* gray scale step */;
  --solid-1: /* gray scale step */;
  /* ...the full 18-token set... */
}

/* Accent theme — same 18 slots, themed scale */
[data-theme='accent'] {
  --ui-1: /* accent scale step */;
  --solid-1: /* accent scale step */;
  /* ... */
}
```

The fixed 18-token shape is what makes this work: every themed palette
implements the **same** set of slots, so there's no asymmetric coverage
and no silent fallback to gray. New themes — success, warning, a brand
palette, or an entirely different aesthetic (game UI, expressive sites)
— drop into the same shape by providing scale values for all 18 roles.

---

## Radius

### Architecture

Radius tokens enable a UI that moves uniformly in response to a single
dynamic value — `--radius`. Changing this one property reshapes every
component that subscribes to it, giving end users full control over the
feel of their interface with no per-component work.

> **Don't animate `--radius`.** Radius tokens carry `calc()` / `min()`
> in their chain; putting `--radius` on a transition,
> `requestAnimationFrame` loop, or `mousemove` handler triggers a
> full-tree style recalculation per frame. Treat it as static in
> production — set it once and leave it. (Color-token reassignment for
> mode switching is fine: a single, infrequent recalculation.)

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

- Whether additional surface levels beyond `--surface-3` are needed —
  deferred until concrete use cases arise.
- Whether to add more theme palettes (success, warning, info) or keep a
  minimal set.
