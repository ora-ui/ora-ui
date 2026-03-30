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

Users should be able to configure components through a clean API —
variants, themes, and component-specific props — without needing to
touch internals.

## See before you install

The playground lets users explore every variant, theme, and
component-specific API across a variety of scenarios before they
commit to installing a component. This is a core part of the product,
not an afterthought.
