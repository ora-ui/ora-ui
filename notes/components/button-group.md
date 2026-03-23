# Button Group

## Status

In progress — core docs written, registry JSON pending. Some examples blocked on components not yet built.

---

## Decisions

- **Button variant for examples**: Settled on `surface` for most examples (`solid` for the With Separator example, `soft` as a sibling to demonstrate contrast).
- **Separator color token**: Using `bg-border-subtle` — avoids hardcoded gray values and stays consistent with the design token system.

---

## Open Questions

- **Separator color adapts to variant**: The separator looks correct for `solid` but may blend into the button background for softer variants (`soft`, `surface`). A potential fix is a `--separator-bg` CSS variable set on `ButtonGroup` and read by `ButtonGroupSeparator`, toggled via `data-variant` attributes on `Button`. Deferred — not worth the complexity until it becomes a real visible problem.

---

## TODOs

Examples blocked on components not yet built:

- [ ] ButtonGroup with `Select` inside
- [ ] ButtonGroup with `Input` inside (e.g. search input + button)
- [ ] ButtonGroup with `DropdownMenu` trigger
- [ ] ButtonGroup with `Popover` trigger

---

## Known Issues

- **Separator inset gap**: `data-vertical:mx-px` and related selectors may not behave as expected depending on how Base UI's Separator sets its data attributes (`data-vertical` boolean vs `data-orientation="vertical"`). The inset gap behaviour is not fully resolved — parked for now.
