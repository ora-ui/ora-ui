# Input

## Status

In progress — core component built with `subtle`, `outline`, and `soft` variants. Docs are missing field composition examples that show real-world usage with label, helper text, and error states.

---

## TODOs

- [ ] Add "With Helper Text" example (input + label + description below)
- [ ] Add "With Error" example (input in `aria-invalid` state + error message)
- [ ] Add "With Button" example (search field or URL bar pattern — input + attached button)
- [ ] Confirm whether a `Field` or `FormField` wrapper component is needed to codify the label + input + helper/error pattern, or whether composition with `Label` is sufficient

---

## Considerations

- The `soft` variant has no border at rest, which means focus state relies entirely on the ring. Worth verifying this is distinguishable enough across light and dark surfaces.
- If a `Field` wrapper component is added later, the `With Label` and `With Helper Text` examples in the docs should be updated to use it as the primary recommendation.
