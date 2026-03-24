# Badge

## Status

In progress — core variants, themes, sizes, and icon support built. Several open questions around accessibility, the warning palette, and link rendering.

---

## Open Questions

- **Warning theme contrast**: The warning (amber) palette currently looks muted rather than vibrant. Needs investigation into whether a more saturated treatment is achievable while still meeting WCAG AA contrast requirements — particularly for text on `soft` and `surface` variants. May require hand-tuning specific steps rather than using the Radix scale directly.

- **Icon-only badge accessibility**: For `size="icon"` badges, a visible label is absent. Need to determine whether an `aria-label` on the badge element is sufficient, or whether a `Tooltip` is required (or both). This is worth researching — screen readers handle icon-only indicators inconsistently, and the right answer may depend on whether the badge is purely decorative or conveys meaningful status. The docs example should be updated once resolved to demonstrate the recommended pattern.

- **Link rendering**: When `render={<a />}` is used, an underline is appearing that shouldn't be there. Needs investigation — likely a prose or global anchor style leaking in. Also worth confirming whether the link example is useful enough to keep in the docs, or whether it belongs in an "Advanced" section.

---

## TODOs

- [ ] Audit warning theme contrast across all variants and adjust palette steps if needed
- [ ] Research icon-only badge accessibility (aria-label vs Tooltip)
- [ ] Update icon-only docs example with the recommended accessibility pattern once resolved
- [ ] Fix underline on link variant and confirm the example is worth keeping

---

## Known Issues

- Warning `soft` variant reads as low-contrast/muted — not visually distinct enough from gray at a glance.
- Link variant shows an underline inherited from global/prose anchor styles.

---

## Considerations

- The `warning` and `success` themes are not present on `Button`. If badge themes expand further, there may be a case for lifting the full theme set up to a shared token level rather than duplicating per component.
