# Principles

These are the non-negotiable beliefs behind Ora. Use them to settle
disagreements and guide decisions when conventions don't cover a situation.

## Accessibility is a first-class concern

Every component must be accessible. This is not a nice-to-have or a
follow-up task — it is considered from the start of every piece of work.
We lean on well-trusted primitives that handle focus management, ARIA
attributes, and keyboard interaction correctly.

## Visual consistency

Components may differ in structure and styling approach based on their
needs, but the system as a whole should feel cohesive. A button, a
dropdown, and a badge should look like they belong together — even if
their internals are quite different.

## Stability

We build on well-trusted, battle-tested primitives rather than rolling
our own interaction behavior. If a reliable primitive exists for what
we need, we use it. This gives us a stable foundation and lets us focus
our effort on the styling and design layer.

## Tokens express intent, not scale

Token names describe what they do, not where they sit on a scale.
`--hover` tells you when to use it. `--gray-200` does not. This means
the same token produces the correct visual contrast in both light and
dark modes without any conditional logic.

## Global constraints, local flexibility

The token architecture gives users a system with clear constraints that
enables versatility — the ability to mold and shape the system to your
use case without breaking out of it. Global tokens (like radius) cascade
to every component that subscribes to them, so a single change can
reshape the entire UI. But local overrides are always possible at the
component level when a specific context demands it.

## Configurability through a styling API

Users should be able to configure components through a clean API
without needing to touch internals. This API has three layers:

1. **Props** — finite, named options that change behavior or structural
   mode (variant, theme, orientation). Use props when there are 2–3
   discrete choices.
2. **CSS custom properties** — open-ended visual tuning knobs scoped to
   a component. These let users adjust values like indicator thickness
   or gap sizes without modifying the component source. They work
   regardless of whether the component is copy-pasted or imported from
   a package.
3. **`data-slot` attributes** — CSS hooks for targeting a component's
   internal parts from the outside, covering customisations that props
   and variables don't anticipate.

Each layer is progressively more flexible and less constrained. Props
are the happy path, CSS custom properties cover the common long tail,
and data-slots are the escape hatch.

## See before you install

The playground lets users explore every variant, theme, and
component-specific API across a variety of scenarios before they
commit to installing a component. This is a core part of the product,
not an afterthought.
