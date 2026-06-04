# Item (pattern)

A child sub-component of a parent container — typically a Group, a
menu, an accordion, or a tab surface. Items are a unit of repetition
inside their parent.

**Direction, not enforcement.** This document describes the shape Item
components in Ora _typically_ take. Specific Items deviate as needed.

## Shape

An Item is a child component that:

- Lives inside a parent container
- Is a unit of repetition inside that parent
- May expose its own props for per-item state (e.g. `value`,
  `disabled`)
- May read shared styling from the parent via React Context when the
  parent propagates it (some parents do, some don't)

Typical usage:

```tsx
<Accordion>
  <AccordionItem value="one">...</AccordionItem>
  <AccordionItem value="two">...</AccordionItem>
</Accordion>
```

Naming convention: sub-components are compound names
(`AccordionItem`, `DropdownMenuItem`, `TabsTab`), not dot notation.

## Common props (menu, not contract)

### Appearance

When the parent propagates Appearance via context, Items typically read
from it rather than redeclaring per-instance. When there's no context,
Items take their own Appearance props directly.

### Structure

Rarely applicable. Items occupy a slot in the parent's arrangement
rather than choosing their own.

### Behavior

| Prop       | What it usually means                                 |
| ---------- | ----------------------------------------------------- |
| `value`    | Identifier used by the parent for selection / routing |
| `disabled` | Item-level disabled state                             |

### Content

The item's label and any leading/trailing decoration (icon, kbd hint,
trailing meta). Items are commonly the locus of Content templates
(text-only / icon + text / icon-only).

## Common slots / content

- **Label** — the primary text, almost always present.
- **Leading icon** — optional.
- **Trailing meta** — optional (kbd shortcut, count, chevron).

## Examples for reference

A few components in the registry whose sub-components fit this
pattern:

- `accordion` — `AccordionItem`
- `dropdown-menu` — `DropdownMenuItem`, plus sub-typed variants
- `toggle-group` — `ToggleGroupItem`
- `radio-group` — `RadioGroupItem`
- `tabs` — `TabsTab`

Read the source of any of these when working on a new Item.

## Sub-typed Item families

When a single parent needs several semantically distinct Item kinds,
each kind is exposed as its own sub-component rather than collapsed
onto one Item with extra props. DropdownMenu illustrates this:
`DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`,
`DropdownMenuSubTrigger` — each carries only the props that apply to
it. This follows Base UI's convention.
