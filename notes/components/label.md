# Label

## Status

In progress — basic component scaffolded and documented, but two fundamental questions are unresolved: whether Label should exist as a standalone component at all, and a known issue with its disabled state styling.

---

## Open Questions

- **Standalone component vs. Field.Label**: It's unclear whether Label should be a first-class component in the registry or whether it only makes sense as `Field.Label` — a sub-component of a future `Field` compound component. Two paths being considered:
  1. Keep `Label` as a standalone component but make the docs explicit that its primary intended use is within a `Field` — treating it as a building block that happens to be independently installable.
  2. Remove `Label` from the components list entirely and defer all label documentation and examples to the `Field` component once it exists.
     The right answer likely depends on whether we want users to compose their own field layouts freely, or whether we want to push them toward the `Field` abstraction as the canonical pattern.

---

## Known Issues

- **`peer-disabled` selector not working**: The label does not dim when its associated input is disabled. The `peer-disabled` Tailwind selector requires the peer element (the input) to precede the label in the DOM, but conventional label-above-input markup places the label first. The current class is effectively dead in the standard layout. Needs investigation — likely requires either reversing DOM order with CSS (e.g. `flex-col-reverse`) or replacing `peer-disabled` with a JS-driven `data-disabled` attribute propagated from a `Field` context.

---

## TODOs

- [ ] Resolve the standalone vs. Field.Label question before investing further in this component
- [ ] Investigate and fix the `peer-disabled` disabled state — determine the correct mechanism (DOM order, data attribute, or context-driven)
- [ ] Update the "Disabled" docs example once the fix is in place
