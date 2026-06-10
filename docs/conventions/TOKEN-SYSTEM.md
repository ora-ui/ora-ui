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

The 18 semantic tokens group into six domains. Bare aliases
(`--border`, `--interactive`) point at step 1 of their ladder for
ergonomics and are not counted as separate slots.

### Background & Surfaces

```css
--background   /* page/app floor */
--subtle       /* solid, one notch above the floor */
--surface-1    /* subtle raised container */
--surface-2    /* most raised */
--overlay      /* modals, popovers, floating elements */
```

`--subtle` is a solid surface a touch above `--background` — quieter
than the raised `--surface-N` ladder (think code blocks, inset panels).
`--surface-N` is an ordinal ladder: 1 is the most subtle raise, 2 the
most raised. `--overlay` is distinct from the surface ladder — it
matches `--background` in light mode and steps up to the first solid
surface in dark mode, so floating elements read correctly against the
page in both.

### UI

Soft interactive container backgrounds, alpha-based so they layer over
any surface. `--ui` is the resting container; `--interactive-N` are its
interaction-state weights.

```css
--ui              /* resting soft container */
--interactive-1   /* first interaction weight (e.g. hover) */
--interactive-2   /* stronger interaction weight (e.g. active) */
--interactive     /* alias → --interactive-1 */
```

The split is rest-vs-interaction, not a pure strength ladder: `--ui`
is where a control sits, `--interactive-N` is where it goes when
touched. Which state reads which level is a component decision (see
[Naming convention](#naming-convention)).

### Solid

Emphatic fill, for solid buttons, badges, and similar high-emphasis
surfaces. A resting fill plus its interaction weight.

```css
--solid               /* resting solid fill */
--solid-interactive   /* fill when interacted (e.g. hover) */
```

`--solid-interactive` replaces the old `bg-fill/90` hover hack. For the
default (gray) palette it is a `color-mix` between the top two scale
steps; themed palettes step up one scale step. Deeper states (active)
are handled per-component via alpha or component vars, not a third
token.

### Borders

Two kinds, and the value type _is_ the distinction.

```css
--separator   /* layout/structural lines — solid */
--border-1    /* ui-element border — alpha */
--border-2    /* stronger ui-element border — alpha */
--border      /* alias → --border-1 */
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
--ui-label    /* foreground when painting on a --ui surface */
--on-solid    /* foreground when painting on a --solid surface */
```

`--primary` / `--secondary` are the two-tier hierarchy. `--ui-label`
and `--on-solid` are contextual — reach for them when the surface
underneath is a ui or solid token respectively. All four remap honestly
under `[data-theme]`.

---

## Naming convention

Two shapes, applied where each is honest:

- **Ordinal strength** where a true intensity ladder exists:
  `--surface-N`, `--border-N`. Named by intensity, not by the state
  they "belong to" — a component maps any state to any level by visual
  intent.
- **Rest / interactive split** where the meaningful distinction is
  interaction, not raw intensity: `--ui` vs `--interactive-N`, `--solid`
  vs `--solid-interactive`. The resting token is where a control sits;
  the interactive token(s) are where it goes when touched.

```tsx
// Soft container: rest, then interaction weights
'bg-ui hover:bg-interactive-1 active:bg-interactive-2';

// Toggle: pressed wants the first interaction weight, not the deepest
'data-[pressed]:bg-interactive-1';

// Solid button: rest fill, hover steps to the interactive fill
'bg-solid hover:bg-solid-interactive';
```

Which state reads which token is a component decision. This replaces
the old `active/75`, `hover/50`, `bg-fill/90` escape-hatch family, where
alpha was used to wrong-name a tone into a different state. States
beyond what the tokens name (e.g. a distinct `active` on a solid fill)
are a component concern — handled via alpha modulation or component
vars, not new system tokens.

---

## Escape hatches: alpha modifiers

Components may use alpha modifiers (`bg-ui/50`, `bg-interactive-1/50`,
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
  fix was to add `--solid-interactive`, not normalise the hack.)

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
  --ui: /* gray role token */;
  --solid: /* gray role token */;
  /* ...the full 18-token set... */
}

/* Accent theme — same 18 slots, themed values */
[data-theme='accent'] {
  --ui: /* accent role token */;
  --solid: /* accent role token */;
  /* ... */
}
```

The fixed 18-token shape is what makes this work: every themed palette
implements the **same** set of slots, so there's no asymmetric coverage
and no silent fallback to gray. New themes — success, warning, a brand
palette, or an entirely different aesthetic (game UI, expressive sites)
— drop into the same shape by providing values for all 18 roles.

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

- Whether additional surface levels beyond `--surface-2` are needed —
  deferred until concrete use cases arise.
- Whether to add more theme palettes (success, warning, info) or keep a
  minimal set.
