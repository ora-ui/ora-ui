# ADR-0011: Component styling API and theming

## Status

Accepted — 2026-11-14

## Context

These choices were spread across `docs/PRINCIPLES.md`,
`docs/conventions/INDEX.md` and `docs/COMPONENT-GUIDE.md`. Those docs
drifted from the code (they still described the removed runtime
`getThemeStyles()` and the old `src/components/ui` path), so they have
been removed ([ADR-0012](0012-documentation-model.md)). The decisions
behind them still hold and are recorded here. How they apply per kind
of component is in [`docs/patterns/archetypes.md`](../patterns/archetypes.md).

## Decision

### Wrap Base UI

Where a Base UI primitive exists, wrap it. Base UI handles behaviour,
focus and accessibility; Ora handles styling. Keep the part structure
close to Base UI's anatomy so users can follow Base UI's docs. Layout
components (Box, Flex, Grid, Stack) have no Base UI equivalent and are
Ora additions.

### Three layers of customisation

1. **Props**: finite, named choices, typically 2–3 values (`variant`,
   `size`, `theme`, `orientation`). Grouped by the
   [ADR-0007](0007-component-prop-taxonomy.md) taxonomy. Reaching for a
   fourth or fifth value is a sign the long tail belongs in a CSS
   custom property.
2. **CSS custom properties**: open-ended tuning knobs scoped to the
   component, always with a fallback: `var(--indicator-size, 0.125rem)`.
   Name them after the component's concept (`--indicator-size`, not
   `--size`). Keep the set small.
3. **`data-slot`**: every part renders `data-slot="<component>-<part>"`
   as a stable hook for outside CSS. Parts also reflect their state as
   `data-variant`, `data-size`, `data-orientation` and so on.

### Theming through `data-theme`

Colour comes from semantic tokens (`bg-ui`, `text-primary`,
`border-border`). A themed component sets
`data-theme={theme !== 'gray' ? theme : undefined}` and the matching
`[data-theme='…']` block in `globals.css` remaps the semantic tokens.
There is no runtime style calculation; the old `getThemeStyles()`
approach is retired.

Theme values default to `'gray' | 'accent'`, with `gray` as the default.
Components that can represent a destructive action add `destructive`.
Components that convey status use the full semantic set
(`accent`, `destructive`, `warning`, `success`).

Reaching into the colour scale directly (for example
`aria-invalid:border-destructive-700`) is allowed when no semantic
token fits, per the semantic-first rule in
[ADR-0009](0009-token-architecture.md). Repeated reaches are a signal to
promote a semantic token.

### Context for style propagation

When a parent's appearance should flow to parts that are not direct
children (portaled popups, items inside a group), the parent provides
it through React Context. This is a DX choice: users set `variant` and
`theme` once instead of on every part. **Local props win**: a part's
own prop overrides the context value (`variant ?? context.variant`).

### Code conventions

- Compound parts are flat named exports (`AccordionItem`), not dot
  notation (`Accordion.Item`).
- Use `cva` for variant classes and `cn()` to merge; export the
  variants function (`buttonVariants`) alongside the component.
- No header JSDoc blocks listing CSS variables or slots. Users own the
  source after install, so the block becomes clutter. Document them on
  the component's docs page instead.

## Consequences

- Adding a new theme is a CSS change (a new `[data-theme]` block), not
  a component change.
- The theme prop types are currently inconsistent: some accept any
  string so users can add their own `[data-theme]` blocks, others are
  closed unions. Tracked as a separate issue; the direction is to make
  every themed component accept custom strings.
- Accessibility and stability come from Base UI, so building without a
  primitive (when one exists) needs a reason recorded in an ADR.
