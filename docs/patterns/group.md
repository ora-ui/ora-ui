# Group (pattern)

A container component that holds a set of related child elements —
usually a `<Name>Item` sub-component, sometimes a sibling primitive
(e.g. `Avatar` inside `AvatarGroup`).

**Direction, not enforcement.** This document describes the shape Group
components in Ora _typically_ take. A specific Group is free to deviate
where its requirements demand it. The goal is to reduce guessability
when starting a new Group component, not to gate-keep what counts as
one.

## Shape

A Group is a parent component that:

- Wraps a set of similar children
- Coordinates their visual or behavioral relationship (arrangement,
  joining, selection state)

Some Groups also propagate shared styling/behavior to children via
React Context (e.g. ToggleGroup, CheckboxGroup). Others are pure
layout shells with no context (e.g. ButtonGroup, AvatarGroup,
InputGroup). Context is a tool, not a requirement of the pattern.

Typical sub-component tree:

```tsx
<ButtonGroup>
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>
```

## Common props (menu, not contract)

Pick the props the specific Group needs. Most Groups expose a subset.

### Appearance

| Prop      | What it usually means                                                              |
| --------- | ---------------------------------------------------------------------------------- |
| `variant` | Stylistic branch — either applied to the Group container or propagated to children |
| `size`    | Sizing branch — same                                                               |
| `theme`   | Theme branch — same                                                                |

When a Group propagates Appearance props to children, it usually does
so via React Context so each child doesn't need them passed individually.

### Structure

| Prop          | What it usually means                                                        |
| ------------- | ---------------------------------------------------------------------------- |
| `orientation` | `"horizontal" \| "vertical"` — arrangement axis of children                  |
| `attached`    | `true \| false` — whether children visually join into one continuous surface |

### Behavior

| Prop                     | What it usually means                                |
| ------------------------ | ---------------------------------------------------- |
| `disabled`               | Propagates to all items                              |
| `value` / `defaultValue` | For selection-style Groups (Toggle, Radio, Checkbox) |
| `onValueChange`          | Selection callback                                   |

## Common slots / content

Most Groups expose:

- **Items** — the primary repeated child (`Group.Item` or a sibling
  primitive). Always present.
- **Separator** — sometimes, for unattached Groups that want explicit
  dividers between items.

## Playground shape

In the Playground controls sidebar, a Group typically renders:

- **Appearance** section — `variant`, `size`, `theme` selects (if exposed)
- **Structure** section — `orientation` toggle, `attached` switch
- **Behavior** section — `disabled` switch
- **Content tab** — item count stepper, per-item label inputs

## Examples for reference

A few components in the registry that fit this pattern:

- `button-group`
- `toggle-group`
- `checkbox-group`
- `radio-group`
- `input-group`
- `avatar-group`

Read the source of any of these when starting a new Group — they
illustrate the range of how this pattern is realised in practice.

## Example divergences

The pattern is useful framing (container + repeated child + shared
styling) even when a Group's specifics push past it. Two examples
worth knowing about:

- **AvatarGroup** swaps the flex arrangement model for an overlapping
  stack. Structure-side props on a Group like this shift to
  overlap-specific concerns rather than the typical `orientation` /
  `attached` shape.
- **ToggleGroup** does more than propagate styling to its items — it
  modifies their _interaction state_ (single-select vs multi-select
  semantics, which Item is currently pressed). The Group is an active
  coordinator, not just a styling shell.

When a Group needs to depart this far, document the specifics on the
component's own docs page rather than reshaping this pattern doc.
