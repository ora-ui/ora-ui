# Textarea

## Status

In progress — core component built with `subtle`, `outline`, and `soft` variants plus `autoResize` prop. Field composition examples are blocked on the `Field` component.

---

## TODOs

- [ ] Add "With Field" example once `Field` component exists — shadcn's docs show `Field`, `FieldLabel`, and `FieldDescription` composing a labelled textarea with a description beneath it; this is the canonical pattern we want to document
- [ ] Add "Invalid with message" example once `Field` component exists — pairing `aria-invalid` with a visible error message below the textarea, driven by field context
- [ ] Revisit `autoResize` browser support note in docs once `field-sizing: content` Safari coverage is clearer — currently noted inline, may not be needed as support matures

---

## Considerations

- `autoResize` and manual `resize-y` are mutually exclusive by design — if `Field` ever wraps `Textarea`, it should not override `autoResize` silently.
- Variant classes mirror `Input` exactly (`subtle`, `outline`, `soft`). If input variants ever change, textarea should be updated in lockstep to stay consistent.
