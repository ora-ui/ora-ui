# Button Group

## Status

In progress — core docs written, registry JSON pending. Some examples blocked on components not yet built.

---

## Decisions

- **Button variant for examples**: Settled on `surface` for most examples (`solid` for the With Separator example, `soft` as a sibling to demonstrate contrast).
- **Separator color token**: Defaults to `bg-border-subtle`. When adjacent to a `solid` button, overrides to a mid-range gray via CSS sibling selectors (`[data-variant=solid]+&` and `&:has(+[data-variant=solid])`), made possible by `data-variant` on `Button`.

---

---

## TODOs

Examples blocked on components not yet built:

- [ ] ButtonGroup with `Select` inside
- [ ] ButtonGroup with `Input` inside (e.g. search input + button)
- [ ] ButtonGroup with `DropdownMenu` trigger
- [ ] ButtonGroup with `Popover` trigger

---

## Known Issues

None currently.

---

## Considerations

- **Solid variant gap inconsistency**: With `ml-px` on the separator, the gap before the first solid button sibling may appear slightly larger than subsequent ones. Needs visual validation — may be a non-issue depending on context.
