# Toggle Group

## Status

In progress — `soft` and `outline` variants with `spacing` and `orientation` support built. Shares the same open questions as [Toggle](./toggle.md) around sizes and a potential solid variant, plus a known issue with icon-only item sizing.

---

## Open Questions

- **Sizes**: Same concern as Toggle — undecided on whether to keep `sm`/`md`/`lg`. The size prop is propagated via context but not documented with examples. Resolution should be made in lockstep with the Toggle component.

- **Solid variant**: Same concern as Toggle — unclear whether a `solid` variant makes sense here. If Toggle gains a solid variant, ToggleGroup should follow.

---

## Known Issues

- **Icon-only items not always square**: When `ToggleGroupItem` contains only an icon, the item does not reliably render as a square — width can collapse or stretch depending on content and spacing context. Needs a mechanism to enforce equal width/height for icon-only items, likely via a detected or explicit `icon` prop that applies fixed `size-*` classes, similar to how `Button` handles `size="icon"`.

---

## TODOs

- [ ] Resolve size prop in lockstep with Toggle — keep, reduce, or remove
- [ ] Add size examples to docs once the size question is resolved
- [ ] Evaluate and add `solid` variant if Toggle adopts one
- [ ] Investigate and fix icon-only item square sizing — determine whether an `icon` boolean prop or a size variant is the right mechanism
- [ ] Audit semantic tokens — current implementation uses shadcn defaults (e.g. `bg-muted`); replace with Ora's own semantic tokens to stay consistent with the rest of the system
