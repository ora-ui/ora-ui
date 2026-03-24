# Toggle

## Status

In progress — `soft` and `outline` variants built, `sm`/`md`/`lg` sizes defined. Open questions around sizes and a potential `solid` variant are unresolved.

---

## Open Questions

- **Sizes**: Undecided on whether to keep `sm`, `md`, `lg`. The size prop is implemented but not documented with examples. Options: keep all three, drop to just `sm`/`md`, or remove the size prop entirely and let consumers control sizing via `className`.

- **Solid variant**: Unclear whether a `solid` variant (filled background, similar to `Button`'s solid) makes sense for Toggle. Would mirror the button variant set more closely but may not be needed — worth revisiting once toggle is used in more real UI contexts.

---

## TODOs

- [ ] Decide on size prop — keep, reduce, or remove
- [ ] Add size examples to docs once the size question is resolved
- [ ] Evaluate whether a `solid` variant is needed and add if so
- [ ] Audit semantic tokens — current implementation uses shadcn defaults (e.g. `bg-muted`, `text-foreground`); replace with Ora's own semantic tokens to stay consistent with the rest of the system
