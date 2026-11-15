# ADR-0010: Radius tiers by role

## Status

Accepted — 2026-11-14

## Context

Ora exposes one global knob, `--radius`, which users set to shape the
whole UI. If every component read it directly, a high value would turn
large surfaces (dialogs, menus, textareas) into blobs while buttons
would look fine. If nothing read it, the knob would do nothing.

The tokens already existed in `globals.css`, with a rationale in
`docs/conventions/TOKEN-SYSTEM.md`. That doc has been removed
([ADR-0012](0012-documentation-model.md)), so the reasoning is recorded
here.

## Decision

Each component part picks a radius **tier** based on its role. The tier
is a design choice made per part, not per component.

| Tier       | Token / utility                                           | Behaviour                                                                            | Typical parts                                                                                      |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Dynamic    | `rounded-dynamic` (`var(--radius)`)                       | Follows `--radius` with no cap                                                       | Button, Toggle, Input, group containers (ButtonGroup, ToggleGroup)                                 |
| Clamped    | `rounded-xs` … `rounded-xl`                               | Scales with `--radius` up to a fixed cap (4/6/10/16/24px)                            | Menus and popups (`md`), dialogs (`lg`), Textarea, Tabs, Accordion, Checkbox, Kbd, Link focus ring |
| Concentric | `rounded-(--menu-item-radius)`, `rounded-(--item-radius)` | Derived from the container radius minus its padding, so nested corners stay parallel | Menu/Select items, attached group items                                                            |
| Fixed      | `rounded-full`                                            | Never changes                                                                        | Radio, Switch, Avatar, scrollbar thumb                                                             |

The rough rule: **small, inline, interactive parts are dynamic; large
surfaces clamp; parts nested inside a padded rounded container are
concentric; parts whose identity is their shape are fixed.** The
per-archetype defaults are listed in
[`docs/patterns/archetypes.md`](../patterns/archetypes.md).

### The eye test beats the rule

We work in a visual domain. When the rule produces something that looks
wrong, the visual result wins and the exception is noted in the pattern
doc. Known exceptions:

- **Textarea is clamped (`rounded-md`), unlike Input (dynamic).** It is
  a text field like Input, but it is usually much taller. At high
  `--radius` values a dynamic radius turns it into a blob.
- **Badge uses its own formula**,
  `min(var(--radius), max(8px, calc(var(--radius) - 10px)))`, so it
  stays pill-like at low radii without becoming over-round at high ones.

### Don't animate `--radius`

Radius tokens use `calc()` and `min()` that all depend on `--radius`.
Changing `--radius` on a transition, animation frame or pointer move
recalculates styles for the whole tree every frame. Set it once and
leave it.

## Consequences

- An agent can usually infer a new component's radius from its
  archetype. It should flag cases where the eye test might disagree
  (large surfaces built from "dynamic" archetypes) for the user to
  check.
- `--radius-md` and friends live in `@theme inline`, so they are not
  emitted as runtime custom properties. Concentric formulas must
  recompute from `--radius` (see the comment above `--menu-item-radius`
  in `globals.css`).
- New exceptions get a line in `archetypes.md`, not a new ADR, unless
  they change the rule itself.
