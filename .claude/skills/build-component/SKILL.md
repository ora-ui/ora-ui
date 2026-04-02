---
name: build-component
description: >-
  Guides building Ora UI components with enforced requirements gathering.
  Use when user asks to build or create a new component, or rework an
  existing shadcn import to follow Ora conventions — e.g. "build a select",
  "create a tooltip", "convert the dialog to Ora conventions". Not needed
  for small changes to components that already follow conventions.
---

# Build Component

This skill enforces the component workflow defined in
[COMPONENT-GUIDE.md](../../../docs/COMPONENT-GUIDE.md). Its primary job
is to ensure requirements are gathered and confirmed before any code is
written.

## When this skill applies

- **New components** — building a component that doesn't exist yet.
- **Convention rework** — reworking an existing shadcn import to follow
  Ora conventions (theming, variants, tokens, interface). This is
  effectively building the component fresh using the existing code as
  a starting point.

This skill does **not** apply to small, targeted changes on components
that already follow Ora conventions (e.g., fixing a color token,
tweaking spacing, adding a single prop). Those are handled fine by the
existing docs.

## Phase 1: Research

Before engaging the user, silently prepare:

1. **Read the component guide** — read `docs/COMPONENT-GUIDE.md` in full.
2. **Read conventions** — read `docs/conventions/INDEX.md` and
   `docs/PRINCIPLES.md`.
3. **Fetch primitive docs** — if the component wraps a Base UI primitive,
   fetch `https://base-ui.com/llms.txt` and read the relevant section.
4. **Read a reference implementation** — pick the closest match from:
   - `button` — standard interactive component
   - `button-group` — container with sub-components
   - `badge` — simple component with polymorphic rendering
   - `dropdown-menu` — complex compositional component with context

   Read the reference file in `apps/docs/src/components/ui/`.

5. **If reworking an existing component** — read the current component
   file and its playground section. Understand what exists before asking
   the user anything.

## Phase 2: Requirements gathering

**This is the critical gate. Do not skip it. Do not proceed to
implementation without explicit user confirmation.**

Interview the user to establish each of the following. If your research
from Phase 1 already suggests an answer, present it for confirmation
rather than asking from scratch.

- [ ] **Variant landscape** — which variants? (e.g., solid, soft, outline)
- [ ] **Theme support** — does it need theming? Which themes?
- [ ] **Component-specific props** — any unique props beyond variants/themes?
- [ ] **Composition** — standalone or sub-components? Context needed?
- [ ] **Border radius behavior** — dynamic, clamped, or fixed per part?
- [ ] **Customisation points** — which CSS custom properties to expose?
- [ ] **UX / DX considerations** — edge cases, ergonomic features?
- [ ] **Playground showcase** — what should the showcase tab display?
      This varies per component and is open-ended — ask the user.

For convention reworks, also establish:

- [ ] **What to preserve** — any existing behavior or API to keep?
- [ ] **What to change** — what doesn't follow conventions and needs reworking?

### Confirm before proceeding

Once all requirements are gathered, present a structured summary:

```
## Requirements summary

**Component:** [name]
**Type:** [new / convention rework]
**Primitive:** [Base UI primitive, if any]

[List each confirmed requirement]

Ready to proceed with implementation?
```

**Wait for the user to confirm.** If they adjust anything, update the
summary and confirm again. Do not write any component code until you
have a clear go-ahead.

## Phase 3: Implementation

Follow the build order from the component guide:

1. Types
2. getThemeStyles (if themed)
3. CVA definition
4. CSS custom properties
5. Component function
6. Exports

For compositional components, follow the dropdown-menu pattern for
context providers, sub-component structure, and export organization.

After implementation, add the interface comment block at the top of
the component file documenting CSS custom properties and slots.

## Phase 4: Playground & checklist

1. Create or update the playground section (showcase + interactive
   playground with controls).
2. Run through the file checklist:
   - [ ] Component implementation
   - [ ] Playground section
   - [ ] Constants (variant/theme arrays in shared constants file)
   - [ ] Documentation page (MDX with frontmatter, installation,
         usage, variants, props table, added to meta.json)
   - [ ] Interface comment block
   - [ ] Registry JSON
