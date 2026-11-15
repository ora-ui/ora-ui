# Archetypes (pattern)

Most Ora components fall into one of a few **archetypes**: groups of
components with the same role, and so the same styling concerns. Classify
a new component first, and most of its API follows: whether it is themed,
which variants it offers, its radius tier, whether it propagates context.

**Direction, not enforcement.** These are observations of the current
code, not rules. A component may deviate when its needs demand it; when
it does on purpose, note it here (small exceptions) or in an ADR
(anything that changes the rule). The reference file for each archetype
is the source of truth: read it before copying anything from this page.

Related: [Group](group.md), [Item](item.md),
[ADR-0010 radius tiers](../adr/0010-radius-tiers-by-role.md),
[ADR-0011 styling API](../adr/0011-component-styling-api.md),
[ADR-0007 prop taxonomy](../adr/0007-component-prop-taxonomy.md).

## At a glance

| Archetype         | Built                                                             | To build (Base UI)                                           | Theme                                        | Variant                              | Radius                                                   | Reference          |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------- | ------------------------------------ | -------------------------------------------------------- | ------------------ |
| Action            | button, toggle, link                                              | —                                                            | `gray \| accent` (+`destructive` for Button) | yes, 3–5                             | dynamic                                                  | `button.tsx`       |
| Selection control | checkbox, radio-group, switch                                     | Slider                                                       | `gray \| accent`, active state only          | `solid \| surface` (Switch has none) | intrinsic: full (radio, switch) or `sm` (checkbox)       | `checkbox.tsx`     |
| Text field        | input, textarea, input-group                                      | NumberField, OTP field                                       | none                                         | `surface \| outline \| soft`         | dynamic (Input); clamped `md` (Textarea, see exceptions) | `input.tsx`        |
| List popup        | select, dropdown-menu                                             | Combobox, Autocomplete, ContextMenu, Menubar, NavigationMenu | `gray \| accent` on the popup                | `soft \| solid`                      | container `md`, items concentric                         | `select.tsx`       |
| Plain overlay     | dialog, alert-dialog, drawer, tooltip                             | Popover, PreviewCard                                         | none                                         | none                                 | clamped, steps up with size (`md` → `lg` → `xl`)         | `dialog.tsx`       |
| Group             | toggle-group, checkbox-group, button-group, avatar-group, toolbar | Fieldset                                                     | inherits from items                          | item variant via context             | container dynamic, items concentric                      | `toggle-group.tsx` |
| Disclosure        | accordion, tabs                                                   | Collapsible                                                  | none                                         | yes                                  | clamped `md`                                             | `accordion.tsx`    |
| Status / display  | badge, avatar, kbd                                                | Meter, Progress, Toast                                       | full semantic set when it shows status       | yes                                  | varies (badge formula, avatar full, kbd `sm`)            | `badge.tsx`        |
| Layout            | separator, scroll-area, label, form                               | Box, Flex, Grid, Stack (Ora additions)                       | none                                         | none                                 | none                                                     | `separator.tsx`    |

## Classifying a new component

Use Base UI's anatomy for the component (from
`https://base-ui.com/llms.txt`) as the signal:

- Single pressable element, no popup → **Action**.
- `Root` + `Indicator`/`Thumb`, holds a checked or numeric value →
  **Selection control**.
- Wraps a native text input, integrates with `Field` → **Text field**.
- `Trigger` + `Portal` + `Positioner` + `Popup` + `Item`s →
  **List popup**.
- `Trigger` + `Portal` + `Popup` with free-form content (title,
  description, actions) → **Plain overlay**.
- Holds several sibling controls and coordinates them → **Group**.
- `Trigger` + `Panel` that shows and hides inline → **Disclosure**.
- Displays a value or state, not interactive → **Status / display**.
- No Base UI primitive, arranges other elements → **Layout**.

If it fits two archetypes (e.g. Toolbar is a Group of Actions), take the
concerns of the outer one for the container and the inner one for the
parts. If it fits none, say so and ask.

## Concerns by archetype

### Theme

Default to `theme?: 'gray' | 'accent'` with `gray` as the default when
unsure. Then:

- Can represent a destructive action (Button, menu items) → add
  `destructive`.
- Conveys status (Badge, Meter, Progress, Toast) → full set: `accent`,
  `destructive`, `warning`, `success`.
- Text fields, overlays, disclosures and layout: no theme. Text fields
  show errors through the invalid state, not a theme.

Selection controls apply the theme to the active state only
(checked box, on switch, filled slider track). The idle state stays
gray.

Apply it with `data-theme={theme !== 'gray' ? theme : undefined}`.

### Variant

Pick from the existing vocabulary rather than inventing names:
`solid`, `soft`, `surface`, `outline`, `ghost`. Most components use 2–5.
List popups currently use `soft | solid`; text fields
`surface | outline | soft`.

### Radius

See [ADR-0010](../adr/0010-radius-tiers-by-role.md). Defaults per
archetype are in the table above.

Known exceptions (eye test over rule):

- **Textarea**: clamped `md`, not dynamic like Input. It is usually tall
  enough that a high `--radius` makes it a blob.
- **Badge**: custom `min()`/`max()` formula so it stays pill-like at low
  radii.

When a new component is a large surface in an archetype that defaults to
dynamic, flag it for an eye test instead of assuming.

### Density

Containers whose items sit inside padding expose
`density?: 'none' | 'compact' | 'comfortable'` (default `comfortable`).
It controls the container padding, and the concentric item radius
follows. Seen on Select and ToggleGroup. Candidates: other list popups,
Toolbar.

### Context propagation

List popups and Groups pass appearance from the root to parts that are
portaled or nested, so users set it once:

```tsx
const SelectContext = React.createContext<SelectContextValue>({ ... });
```

**Local props win**: `const variant = props.variant ?? context.variant`.
Only propagate appearance (variant, theme, size, density) and structure
(orientation, attached). Behaviour stays with Base UI.

### Data attributes

Every part sets `data-slot="<component>-<part>"`. Parts also reflect
their appearance and structure as `data-variant`, `data-size`,
`data-orientation`, `data-density`, `data-attached` where they apply,
so outside CSS can target them.

### Field integration

Text fields and selection controls should work inside Base UI's `Field`
and show the invalid state via `aria-invalid` (currently styled with
`aria-invalid:border-destructive-700`; see `input.tsx`).

### Overlays reuse Button

Plain overlays don't style their own close or action buttons; they
render Ora's `Button` (see `alert-dialog.tsx`).

## Open questions

- Theme prop types: some components accept custom theme strings, some
  don't. Direction: all themed components accept them.
- Invalid-state styling reaches the destructive scale directly. It may
  become a semantic remap (like `[data-theme]`) once the pattern settles.
- Toast's theme surface (full semantic set vs `type`) is undecided.
