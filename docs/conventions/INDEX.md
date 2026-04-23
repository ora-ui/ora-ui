# Conventions

These are the current target conventions for Ora components. The codebase
is in transition — not all components reflect these patterns yet. When in
doubt, follow what's documented here, not what you see in an arbitrary
component file.

## Reference implementations

These components follow current conventions and should be used as models
for new work:

- `button` — standard interactive component with full variant/theme support
- `button-group` — container component with sub-components
- `badge` — simple component with polymorphic rendering via useRender
- `dropdown-menu` — complex compositional component with React Context

When building or modifying a component, read the relevant reference
implementation first.

## Component patterns

Not every component uses every pattern below. A label may need none of
them. A dropdown menu may need all of them. Which patterns apply depends
on the component's needs — its structure, its variant landscape, and
whether it supports theming.

### Theming via semantic tokens and data-theme

Components use semantic tokens (--ui, --fill, --hover, --active, etc.) that automatically adapt to the current theme. Theme switching happens at the CSS level through `[data-theme]` selectors, not through runtime JavaScript.

**The pattern:**

1. **Component uses semantic tokens** in Tailwind classes:

```tsx
const buttonVariants = cva('text-ui-label bg-ui hover:bg-hover active:bg-active border-line-ui');
```

2. **Component sets data-theme attribute** (not style prop):

```tsx
<ButtonPrimitive
  data-theme={theme !== 'gray' ? theme : undefined}
  className={cn(buttonVariants({ variant, size }))}
/>
```

3. **CSS remaps tokens for each theme**:

```css
/* Default (gray) theme - no attribute needed */
:root {
  --ui: oklch(0 0 0 / 0.059);
  --fill: oklch(0.14 0 0);
  --hover: oklch(0 0 0 / 0.091);
  /* ... */
}

/* Accent theme */
[data-theme='accent'] {
  --ui: var(--accent-ui);
  --fill: var(--accent-fill);
  --hover: var(--accent-hover);
  /* ... */
}
```

**Why this approach:**

- No runtime style calculation overhead
- Themes are composable at CSS level
- Works with component-scoped gradients (data-slot + data-variant)
- Theme tokens defined once in globals.css, automatically apply everywhere
- Easier to add new themes without touching component code

**Previous approach (deprecated):**
The old `getThemeStyles()` function computed CSS variables at runtime and
passed them via the style prop. This worked but added JavaScript overhead
and made theming harder to reason about. Existing components still using
this pattern should be migrated to semantic tokens + data-theme.

### CVA variant definition

CVA handles variant styles using semantic tokens — layout, sizing,
spacing, and colors via token classes (bg-ui, text-primary, border-line-ui).

Each component defines its own variant landscape. There is no global set —
a button may offer solid/outline/surface/soft/ghost while a dropdown only
offers solid/soft. This is determined per component based on its needs.

```tsx
const buttonVariants = cva('text-ui-label rounded-dynamic focus-visible:outline-focus', {
  variants: {
    variant: {
      solid: 'bg-fill text-on-fill hover:bg-fill/90 active:bg-fill/80',
      outline: 'border border-line-ui bg-transparent hover:bg-hover/30',
      soft: 'bg-ui hover:bg-hover active:bg-active',
      ghost: 'hover:bg-hover active:bg-active',
    },
    size: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-7.5 px-3',
      lg: 'h-10 px-6',
    },
  },
});
```

Use props for finite, named options (2-3 choices). For open-ended
visual customisation, let CSS custom properties handle it.
If you find yourself reaching for a fourth or fifth variant value,
that's a signal the long tail belongs to token overrides, not props.

Export both the component and its variants (e.g., `buttonVariants`) so
consumers can access variant styles independently.

### Base UI primitive wrapping

Where a Base UI primitive exists, wrap it rather than building from
scratch. The primitive handles behavior and accessibility; we handle
styling.

### Data attributes

- `data-slot="component-name"` — user-facing CSS hook for targeting
  components from the outside
- `data-variant` / `data-theme` — reflect current styling state

### React Context for style propagation

Use React Context when a parent component needs to propagate styling
to children that are not direct descendants in the DOM — for example,
portaled content like sub-menus.

This is a developer experience choice. We could require users to pass
variant and theme to every sub-component manually, but context removes
that friction. If a child is a direct descendant and can receive values
through the tree, prefer that over context.

## Component interface

Every component exposes a customisation interface through three layers
described in [Principles — Configurability through a styling API](../PRINCIPLES.md#configurability-through-a-styling-api).
This section covers the conventions for each layer.

### Props

Use props for finite, named options (2–3 choices) that change the
component's behavior or structural mode. These are defined through CVA
variants and component-specific props. If you find yourself reaching for
a fourth or fifth value, that's a signal the long tail belongs to CSS
custom properties, not props.

### CSS custom properties

Use component-scoped CSS custom properties for open-ended visual
customisation — values a user is likely to want to tweak but that don't
warrant a named prop.

Semantic tokens (`--ui`, `--fill`, `--hover`, etc.) already provide theme
customisation. Component-specific properties handle structural overrides:

```tsx
// Indicator thickness — overridable via style prop or ancestor CSS
className={cn(
  'h-[var(--indicator-size,0.125rem)]',  // 2px default
  ...
)}
```

Users override these via the `style` prop, a parent's CSS, or a
stylesheet — no source changes needed in either distribution model.

**Guidelines:**

- Provide a sensible default using CSS fallback syntax
  (`var(--name, fallback)`)
- Namespace to the component: `--indicator-size`, not `--size`
- Keep the set small — expose the customisation points users are most
  likely to reach for, not every internal value
- For theming needs, use semantic tokens instead of component-scoped variables

### `data-slot` attributes

Every component and sub-component renders a `data-slot` attribute
(e.g., `data-slot="tabs-indicator"`). This lets users target internal
parts from external CSS for customisations that props and CSS custom
properties don't cover.

### Documenting the interface

Each component file should include a brief comment block listing its
CSS custom properties and slots. This makes the interface discoverable
without reading through the Tailwind classes:

```tsx
/**
 * CSS custom properties:
 * --indicator-size    Thickness of the active indicator (default: 2px)
 *
 * Slots: tabs, tabs-list, tabs-tab, tabs-indicator, tabs-panel
 */
```

This block also serves as the basis for documentation pages and is
useful regardless of distribution model — copy-paste users see it in
the file, package users see it in the docs.

---

## Token usage

Tokens express intent. Use semantic tokens, never raw scale values.

```tsx
// Good: semantic token — adapts to light/dark automatically
className = 'bg-hover';

// Bad: raw scale value — breaks across themes
className = 'bg-gray-100 dark:bg-gray-800';
```

The token set is finite and constrained by design — we deliberately
avoid a sprawl of overlapping tokens that become hard to reason about.
When no existing token fits a specific need, use Tailwind's opacity
modifier (e.g., `text-foreground/50`) rather than inventing a new token.

For the full token architecture, domains, and available tokens, see
[TOKEN-SYSTEM.md](TOKEN-SYSTEM.md).
