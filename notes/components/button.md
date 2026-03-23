# Button

## Status

In progress — core variants and theme system built, docs written. Size API and icon button approach unresolved.

---

## Key Decisions

- **`solid + gray` uses scale extremes for light/dark inversion**: The gray solid button uses `--btn-theme-950` for background and `--btn-theme-50` for text. Since the gray scale inverts between modes, this avoids any dark mode override while still reading as near-black on white and near-white on black.

---

## Open Questions

- **Size variants vs single responsive size**: Undecided whether to keep `sm`, `md`, `lg` or move to a single size that adapts to context.
- **Icon button approach**: Three options on the table:
  1. `size="icon"` — icon mode as a size value, everything in one component
  2. Separate `<IconButton />` — makes the icon-only constraint explicit at the type level, easier to enforce `aria-label`
  3. Both — `size="icon"` as a shorthand plus `<IconButton />` for explicit use

---

## TODOs

- [ ] Resolve size API (keep variants / go single size)
- [ ] Resolve icon button approach and implement
- [ ] Document size variants once finalised

---

## Known Issues

None yet.

---

## Considerations

- **`dark:border-input` on `outline` and `surface`**: Carried over from the shadcn base. With the ring approach, this may be redundant or conflicting. Worth auditing when dark mode styling is properly reviewed.
- **`outline + gray` compound only overrides text**: The ring color adjustment for gray outline was stripped during cleanup. May need revisiting once visually tested against accent and destructive variants.
