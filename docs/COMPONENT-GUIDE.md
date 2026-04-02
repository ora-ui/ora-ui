# Component Guide

Step-by-step direction for building and modifying Ora components.

> **Skill available:** Use `/build-component` when creating a new
> component or reworking an existing shadcn import to follow Ora
> conventions. The skill enforces this workflow interactively.

## Before you start

Always read the documentation for the primitive you're building on.

For Base UI components, fetch the llms.txt file at
`https://base-ui.com/llms.txt` and read the docs for the relevant
component. Understand its API, composition rules, and nesting
requirements before writing any code. Many issues — especially around
composition (e.g., which sub-components must be nested inside which
parents) — are answered directly in the primitive's documentation.

Then read the closest reference implementation in the codebase.
See [Conventions — Reference implementations](conventions/INDEX.md#reference-implementations)
for the current list.

## Gather requirements

**This step is mandatory — for new components AND modifications to
existing ones.** Do not start implementation until the user has
confirmed the requirements. Reading existing code is not a substitute
for interviewing the user about what they want.

### New components

Interview the user to establish:

- **Variant landscape** — which variants does this component need?
  (e.g., solid, soft, outline). Not every component needs all variants.
- **Theme support** — does this component need theming? If so, which
  themes? (e.g., gray, accent, destructive)
- **Component-specific props** — are there props unique to this
  component that aren't covered by variants and themes?
- **Composition** — is this a simple standalone component, or does it
  have sub-components? Does it need React Context for style propagation?
- **Border radius behavior** — what is the radius nature of this
  component and its sub-components? Should it subscribe to the dynamic
  radius (buttons, inputs), use a clamped value from the scale
  (cards, overlays), or be fixed to full (radio buttons)?
  For compositional components, each part may have a different answer.
  See [Token System — Radius](conventions/TOKEN-SYSTEM.md#radius).
- **Customisation points** — which visual properties are users most
  likely to want to adjust? These become CSS custom properties with
  sensible defaults (see [Conventions — CSS custom properties](conventions/INDEX.md#css-custom-properties)).
- **UX / DX considerations** — any ergonomic features, edge cases, or
  interaction details the user has in mind?

If the Base UI docs or an existing reference implementation answer some
of these, confirm your understanding with the user rather than asking
from scratch.

### Reworking existing shadcn imports

Some components were imported from shadcn and need reworking to follow
Ora conventions. This is effectively building the component fresh — the
existing code is a starting point, not a spec. Follow the full new
component interview above, and additionally establish:

- **What to preserve** — any existing behavior or API worth keeping.
- **What to change** — what doesn't follow conventions and needs
  reworking (theming, tokens, variant structure, interface).

Read the existing component file first, then present your understanding
of its current state alongside the requirements for confirmation.

## Implementation

Build in this order:

1. **Types** — define the variant, theme, and prop types
2. **getThemeStyles** — if the component supports theming, write the
   theme styles function (see [Conventions — Theme styles function](conventions/INDEX.md#theme-styles-function))
3. **CVA definition** — structural styles, variant classes
4. **CSS custom properties** — define component-scoped custom properties
   for the customisation points identified during requirements gathering
   (see [Conventions — CSS custom properties](conventions/INDEX.md#css-custom-properties))
5. **Component function** — wrap the Base UI primitive (or build from
   scratch if no primitive exists), apply styles, data attributes
6. **Exports** — export the component and its variants

For compositional components (multiple sub-components), follow the
dropdown-menu reference implementation for the pattern of context
providers, sub-component structure, and export organization.

## Playground section

Required for all visual components. Non-visual components (e.g.,
visually-hidden) are exempt.

The playground serves the "see before you install" principle — users
should be able to explore the component across a variety of scenarios
before committing to it.

### What to show

Derive the scenarios to display from two sources:

1. **The Base UI docs** — examples in the primitive's documentation
   reveal the different states and configurations the component can
   exist in (e.g., hover, with checkbox items, with radio items)
2. **The gathered requirements** — the variant landscape, themes, and
   component-specific props established during the requirements step

### Structure

Each playground section has two tabs:

- **Overview** — a grid showing the component across all variant/theme
  combinations at a glance
- **Playground** — an interactive preview with controls for each
  configurable prop

Balance coverage with cognitive load. Show enough scenarios to give
users a strong sense of the component's versatility, but don't
overwhelm with redundant or trivial variations.

See the button or dropdown-menu playground sections as reference
implementations.

## File checklist

When a component is complete, ensure the following exist:

- **Component implementation** — the component source file
- **Playground section** — overview grid and interactive playground
- **Constants** — variant/theme arrays added to the shared constants file
- **Documentation page** — MDX file with frontmatter (title, description),
  installation command, usage example, variant/theme showcases, and a
  props table. The component slug must also be added to the components
  `meta.json` pages array for it to appear in the sidebar.
- **Interface comment block** — CSS custom properties and slots
  documented at the top of the component file
  (see [Conventions — Documenting the interface](conventions/INDEX.md#documenting-the-interface))
- **Registry JSON** — for installation via the shadcn CLI
