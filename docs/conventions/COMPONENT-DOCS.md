# Component Documentation

Conventions for writing and maintaining component docs pages in `apps/www/content/docs/components/`.

---

## Page structure

Every component page follows this order:

```
Hero preview          ← above Installation, no heading
## Installation
## Usage
## Examples
  ### Example name   ← h3, sentence case, one per scenario
## API Reference
```

### Hero preview

Sits directly below the frontmatter with no heading. Shows the component in its most representative state — typically one item open, a realistic content, and a constrained width:

```mdx
<ComponentPreview name="accordion-hero" />

## Installation
```

### Installation

Two tabs — CLI and Manual. The Manual tab always has three steps:

1. Install dependencies (`CodeBlockTabs` with pnpm / npm / bun / yarn)
2. Copy the component (`<ComponentSource name="<name>" />` — never pasted source)
3. Update import paths

### Usage

A minimal import + JSX snippet showing the full sub-component tree needed to render the component. No prose, just code.

### Examples

Each scenario gets its own `### h3` heading (sentence case) and a one-line description above the preview:

```mdx
### Multiple

Set `multiple` to allow more than one panel to be open simultaneously.

<ComponentPreview name="accordion-multiple" />
```

Name examples by the scenario or behavior they demonstrate, not by visual style. `multiple` not `expanded-state`.

### API Reference

See [API Reference convention](#api-reference-convention) below.

---

## Frontmatter

```yaml
---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal associated content.
links:
  doc: https://base-ui.com/react/components/accordion
  api: https://base-ui.com/react/components/accordion#api-reference
---
```

Include `links.doc` and `links.api` for any component that wraps a Base UI primitive.

---

## API Reference convention

### Compound primitive components

Components that are thin wrappers around Base UI sub-components with no props of their own (no CVA variants, no custom logic) use a single link instead of a table:

```mdx
## API Reference

For more information, see the Base UI [Accordion API Reference](https://base-ui.com/react/components/accordion#api-reference).
```

### Components with own props

Components that define CVA variants, custom props, or non-trivial logic
get a full table. If there are multiple sub-components, use
`### SubComponentName` headings. Within a sub-component, group props by
the [taxonomy categories](../adr/0007-component-prop-taxonomy.md)
(Appearance / Structure / Behavior) using `####` subheadings. Skip the
subheadings when the sub-component has ≤2 own props — overkill at that
size; a single flat table is fine.

End with a forwarding note:

```mdx
## API Reference

### ToggleGroup

#### Appearance

| Prop      | Type                             | Default  |
| --------- | -------------------------------- | -------- |
| `variant` | `"soft" \| "outline" \| "solid"` | `"soft"` |

#### Structure

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

### ToggleGroupItem

All other props are forwarded to the underlying [Base UI Toggle](https://base-ui.com/components/toggle) primitive.
```

Categories come from the component's Playground Entry schema — when a
schema declares a prop's `category`, the docs table follows. Content
props are not in the API table (they're a Playground concern, not a
prop the consumer passes); they're shown via examples on the docs page.

---

## ComponentPreview rules

- Never put inline code or JSX children inside `<ComponentPreview>` — the preview file handles rendering
- For distinct behavioral scenarios, each scenario is a separate preview file (`accordion-default.tsx`, `accordion-multiple.tsx`)
- For visual variants that share the same content (solid / outline / ghost), use the multi-export + `select` pattern — see the scaffolder reference in the `document-component` skill

### Interactive previews (select pattern)

Use `select` when an example shows multiple visual variants of the same scenario and the viewer benefits from switching between them without leaving the page — e.g. `solid / outline / soft / ghost` under a single "Variants" heading.

**Don't** use `select` for:

- Singular examples that stand alone — e.g. `icon-only`, `loading`
- Polymorphic examples that change the rendered element — e.g. `as-a-link`
- Behavioral examples that differ in structure or markup, not just visual style

There is no deterministic rule. When documenting a component, ask the user which examples (if any) should be interactive before writing any preview files.

---

## What NOT to do

- Don't paste component source as a code block in the MDX — use `<ComponentSource name="..." />`
- Don't add a `## Hero` heading above the hero preview
- Don't use `##` for example sections — always `###`
- Don't write a full props table for compound primitives — link to the Base UI API Reference instead
