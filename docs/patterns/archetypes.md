# Archetypes (pattern)

Most Ora components fall into one of a few **archetypes**: groups of
components with the same role, and so the same styling concerns. Classify
a new component first, and most of its API follows: whether it is themed,
which variants it offers, its radius tier, whether it propagates context.

**Mostly direction.** Most of this page describes the current code, not
rules. A component may deviate when its needs demand it; when it does on
purpose, note it here (small exceptions) or in an ADR (anything that
changes the rule). The reference file for each archetype is the source
of truth: read it before copying anything from this page.

**Checked rules.** `pnpm --filter www check:conventions` runs in the
pre-commit hook and in CI. It fails when a component breaks one of these:

- [Data attributes](#data-attributes): every exported component sets
  `data-slot`. A component that only provides context and renders no
  element of its own is exempt. The other data attributes are not
  checked.
- [Theme](#theme): `data-theme` uses the documented formula, and a
  `theme` prop accepts custom strings.
- [Docs page, playground entry and install file](#docs-page-playground-entry-and-install-file):
  each component has all three.

Known breaks are listed in `apps/www/scripts/conventions-baseline.json`.
That list only shrinks: fixing a break fails the check until its entry is
deleted.

Related: [Group](group.md), [Item](item.md),
[ADR-0010 radius tiers](../adr/0010-radius-tiers-by-role.md),
[ADR-0011 styling API](../adr/0011-component-styling-api.md),
[ADR-0007 prop taxonomy](../adr/0007-component-prop-taxonomy.md).

## At a glance

| Archetype         | Built                                                             | To build (Base UI)                                           | Theme                                                                             | Variant                                                                                                                        | Radius                                                                                                                                  | Reference          |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Action            | button, toggle, link                                              | —                                                            | `gray \| accent` (+`destructive` for Button, Link)                                | `solid \| outline \| surface \| soft \| ghost` (+`on-solid` for Toggle in a filled container; Link has none, only `underline`) | dynamic (Link: fixed `xs`)                                                                                                              | `button.tsx`       |
| Selection control | checkbox, radio-group, switch                                     | Slider                                                       | `gray \| accent`, active state only (Checkbox, Switch; RadioGroup has no `theme`) | `solid \| surface` (Checkbox, RadioGroupItem; Switch has none)                                                                 | intrinsic: full (radio, switch) or `sm` (checkbox)                                                                                      | `checkbox.tsx`     |
| Text field        | input, textarea, input-group                                      | NumberField, OTP field                                       | none                                                                              | `surface \| outline \| soft` (InputGroup has none; its addon variant is declared but not wired)                                | dynamic (Input, InputGroup); clamped `md` (Textarea, see exceptions)                                                                    | `input.tsx`        |
| List popup        | select, dropdown-menu                                             | Combobox, Autocomplete, ContextMenu, Menubar, NavigationMenu | `gray \| accent` on the popup                                                     | `soft \| solid`                                                                                                                | container `md`, items concentric                                                                                                        | `select.tsx`       |
| Plain overlay     | dialog, alert-dialog, drawer, tooltip                             | Popover, PreviewCard                                         | none                                                                              | none                                                                                                                           | fixed, no `size` prop: `lg` (Dialog, AlertDialog), `rounded-t-xl` (Drawer), `md` (Tooltip)                                              | `dialog.tsx`       |
| Group             | toggle-group, checkbox-group, button-group, avatar-group, toolbar | Fieldset                                                     | ToggleGroup, CheckboxGroup: `theme` via context; others none                      | ToggleGroup (`itemVariant`), CheckboxGroup (`variant`) via context; others none                                                | ToggleGroup: container dynamic, items concentric; others see Context propagation                                                        | `toggle-group.tsx` |
| Disclosure        | accordion, tabs                                                   | Collapsible                                                  | none                                                                              | Accordion item: `underline \| soft`, plus a root `bordered` boolean. Tabs list: `soft \| solid`                                | clamped `md` (bordered Accordion, TabsSurface); Tabs triggers `sm`, Accordion triggers square with outer corners concentric to the root | `accordion.tsx`    |
| Status / display  | badge, avatar, kbd, progress                                      | Meter, Toast                                                 | Badge: full semantic set. Avatar: `gray \| accent`. Kbd: none                     | Badge `solid \| soft \| outline \| surface`, Kbd `ghost \| soft \| surface`, Avatar none                                       | varies (badge formula, avatar full, kbd `sm`, progress track clamped `xs`)                                                              | `badge.tsx`        |
| Layout            | separator, scroll-area, label, form                               | Box, Flex, Grid, Stack (Ora additions)                       | none                                                                              | none                                                                                                                           | none                                                                                                                                    | `separator.tsx`    |

### Outside the archetype model

Three registry components fit no archetype, and that is fine.

- **sidebar**: an app-shell layout part. It has no Base UI primitive, no variant or theme, and only its items are rounded (`md`). Its context carries only `collapsed` state.
- **sonner**: a themed wrapper around the `sonner` library, not Base UI. It follows `next-themes` and reads `--radius` for the toast radius. Toast is on the Status / display to-build list instead.
- **visually-hidden**: a screen-reader-only `span` utility. It has no appearance concerns.

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

Default to `gray | accent` with `gray` as the default when unsure. Type
it as a local alias that also accepts custom strings, so a user's own
`[data-theme='brand']` block works and the known values still
autocomplete:

```tsx
type Theme = 'gray' | 'accent' | (string & {});
```

Plain `string` drops the autocomplete, so the check requires
`(string & {})`. Then:

- Can represent a destructive action (Button, menu items) → add
  `destructive`.
- Conveys status (Badge, Meter, Progress, Toast) → full set: `accent`,
  `destructive`, `warning`, `success`.
- Text fields, overlays, disclosures and layout: no theme. Text fields
  show errors through the invalid state, not a theme.

Apply it with `data-theme={theme !== 'gray' ? theme : undefined}`.

**Active-state variant.** Toggle and Switch set `data-theme` only while
pressed or checked, so the idle state stays gray:

```tsx
// toggle.tsx
data-theme={theme !== 'gray' && pressed ? theme : undefined}
// switch.tsx
data-theme={theme !== 'gray' && isChecked ? theme : undefined}
```

Checkbox sets `data-theme` unconditionally, but its theme styles apply
to the checked and indeterminate states only. The same goes for a slider
track when it is built. RadioGroup has no `theme` prop at all.

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
- **Link**: fixed `rounded-xs`.
- **Progress**: the track is clamped `xs`, not dynamic. It is only 4 to
  12px tall, so a dynamic radius makes it a pill from the smallest step.
  The 4px cap keeps the `md` and `lg` tracks short of a pill at every
  preset.
- **Plain overlays**: no `size` prop, so the radius is fixed. Dialog and
  AlertDialog use `rounded-lg`, Drawer uses `rounded-t-xl` (top corners
  only), Tooltip uses `rounded-md`.
- **ButtonGroup**: no container radius. Items keep their own dynamic
  radius and only the inner corners square off.
- **Toolbar**: no root radius. ToolbarButton and ToolbarLink are pills
  (`rounded-4xl`).

When a new component is a large surface in an archetype that defaults to
dynamic, flag it for an eye test instead of assuming.

### Density

Containers whose items sit inside padding expose
`density?: 'none' | 'compact' | 'comfortable'` (default `comfortable`).
It controls the container padding, and the concentric item radius
follows. Seen on Select and ToggleGroup only (checked against every
`registry/ui` file). Candidates: other list popups,
Toolbar.

### Context propagation

List popups, Tabs and some Groups pass appearance from the root to
parts that are portaled or nested, so users set it once:

```tsx
const SelectContext = React.createContext<SelectContextValue>({ ... });
```

**Local props win**: `const variant = props.variant ?? context.variant`.

What each Group does today:

| Group         | Context                                                        | Container radius                                 | Item radius                                |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------ |
| ToggleGroup   | yes: `itemVariant`, `size`, `theme`, `attached`, `orientation` | dynamic, except variant `none` (no radius)       | concentric via `--item-radius` and density |
| CheckboxGroup | yes: `variant`, `theme`                                        | none (plain flex column)                         | Checkbox's own `sm`                        |
| ButtonGroup   | none                                                           | none, inner corners of attached items square off | each Button's own dynamic radius           |
| AvatarGroup   | none                                                           | none (overlapping stack)                         | Avatar's own full radius                   |
| Toolbar       | none                                                           | none                                             | pills (`rounded-4xl`), not concentric      |

ToggleGroup and CheckboxGroup match the pattern. ButtonGroup,
AvatarGroup and Toolbar are exceptions. They are layout shells.

Only propagate appearance (variant, theme, size, density) and structure
(orientation, attached). Behaviour stays with Base UI.

### Data attributes

Every exported component sets `data-slot`: `"<component>"` on the root
(`data-slot="button"`) and `"<component>-<part>"` on the other parts
(`data-slot="select-trigger"`). Parts also reflect their appearance and
structure as `data-variant`, `data-size`, `data-orientation`,
`data-density`, `data-attached` where they apply, so outside CSS can
target them.

### Docs page, playground entry and install file

Every `registry/ui` component ships with three files beside it:

- a docs page at `docs/content/components/<name>.mdx`
  (`pnpm --filter www scaffold component <name> ...` creates it for a new
  component; `scaffold docs` creates the page and its previews for an existing one),
- a playground entry at `playground/entries/<name>.tsx`,
- a published install file at `public/r/<name>.json`
  (`scaffold component` writes it; `pnpm --filter www build:registry`
  rebuilds all of them).

### Field integration

Text fields and selection controls should work inside Base UI's `Field`
and show the invalid state via `aria-invalid` (currently styled with
`aria-invalid:border-destructive-700`; see `input.tsx`).

### Overlays reuse Button

Plain overlays don't style their own close or action buttons; they
render Ora's `Button` (see `alert-dialog.tsx`).

## Open questions

- Theme prop types: some components accept custom theme strings (Button,
  Link, Toggle, ToggleGroup, Switch, Avatar), some don't (Badge,
  Checkbox, CheckboxGroup, Select, DropdownMenu). The desired state is that all themed
  components accept them. That is not reached yet. Tracked in
  [#283](https://github.com/ora-ui/ora-ui/issues/283). The conventions
  check baselines these as `theme-open`.
- Invalid-state styling reaches the destructive scale directly. It may
  become a semantic remap (like `[data-theme]`) once the pattern settles.
- Toast's theme surface (full semantic set vs `type`) is undecided.
