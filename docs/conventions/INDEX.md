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

### Theme styles function

`getThemeStyles()` handles color-related CSS variables. Its purpose is
to enable theming ergonomically — rather than defining a matrix of CVA
conditions per theme, we set CSS variables on the component's style prop.

Only components that support theming need this.

```tsx
// Good: CSS variables adapt to any theme value
const getThemeStyles = (theme: Theme): React.CSSProperties =>
  ({
    '--background-ui': `var(--${theme}-a100)`,
    '--hover': `var(--${theme}-a200)`,
  }) as React.CSSProperties;

// Bad: hardcoded theme conditions in className strings
const cls = theme === 'accent' ? 'bg-accent-100' : 'bg-gray-100';
```

### CVA variant definition

CVA handles structural styles — layout, sizing, border-radius, spacing.
Color is handled by getThemeStyles, not CVA.

Each component defines its own variant and theme landscape. There is no
global set — a button may offer solid/outline/surface/soft/ghost while
a dropdown only offers solid/soft. This is determined per component
based on its needs.

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
