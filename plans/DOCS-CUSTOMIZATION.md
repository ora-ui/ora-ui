# Docs Site Customization Plan

## Goal

Progressively replace Fumadocs' built-in UI components with Ora UI's own components, using Fumadocs purely as a framework (routing, search, MDX pipeline, layout primitives) while owning all the visual layer.

We are not ready to start this yet — this document captures the approach so we can act on it incrementally as more components become available.

---

## Core Mechanism: `getMDXComponents`

The primary entry point for swapping Fumadocs components is a function called `getMDXComponents`, placed in `mdx-components.tsx` at the project root.

```tsx
// mdx-components.tsx
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents, // Fumadocs defaults (Cards, Callouts, Code Blocks, Headings)
    ...components, // caller-supplied overrides win
  };
}
```

Pass it explicitly in `page.tsx`:

```tsx
import { getMDXComponents } from '@/mdx-components';

<MDXContent components={getMDXComponents()} />;
```

> **Note:** As of April 2025, `mdx-components.tsx` is no longer applied globally — it must be explicitly imported and passed to the MDX renderer.

Any HTML element (`h1`, `p`, `a`, `pre`, `ul`, etc.) or named MDX component can be replaced by adding it as a key in this object.

---

## What We Can Customize and How

### Typography (Headings, Body, Prose)

Override any HTML element key in `getMDXComponents`:

```tsx
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    h1: (props) => <Heading size="xl" {...props} />,
    h2: (props) => <Heading size="lg" {...props} />,
    p: (props) => <Text {...props} />,
    a: (props) => <Link {...props} />,
    ...components,
  };
}
```

Global prose styling (line height, font size, spacing) is controlled via Fumadocs' built-in typography plugin and the `prose` class. Do not use `@tailwindcss/typography` alongside it — they conflict.

---

### Code Blocks

Fumadocs exposes `CodeBlock` and `Pre` primitives. Override the `pre` key to wrap them with our own shell:

```tsx
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

pre: ({ ref: _ref, ...props }) => (
  <CodeBlock {...props}>
    <Pre>{props.children}</Pre>
  </CodeBlock>
),
```

`CodeBlock` props of interest:

| Prop             | Description                                                               |
| ---------------- | ------------------------------------------------------------------------- |
| `keepBackground` | Preserves Shiki's generated background instead of using the theme default |
| `icon`           | Custom icon in the code block header                                      |

For code blocks rendered outside of MDX (e.g. in component demos), use `DynamicCodeBlock` or `ServerCodeBlock`, both of which accept `options.components` to override `pre` and `code` directly.

---

### Tabs

Import and spread Fumadocs' Tabs components into `getMDXComponents`:

```tsx
import * as TabsComponents from 'fumadocs-ui/components/tabs';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...components,
  };
}
```

For fully custom tab layouts (with icons, etc.), use the low-level primitives directly:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from 'fumadocs-ui/components/tabs';
```

Tabs support persistence (`localStorage`/`sessionStorage`), URL hash linking, and cross-tab syncing via `groupId`.

---

### Global Colors / Theming

Fumadocs uses `fd-` prefixed CSS variables for all color tokens. Override them in `globals.css`:

```css
:root {
  --color-fd-background: ...;
  --color-fd-foreground: ...;
  --color-fd-primary: ...;
  --color-fd-border: ...;
  --color-fd-muted: ...;
  --color-fd-accent: ...;
}
```

These map to Tailwind utility classes like `bg-fd-background`, `text-fd-primary`, etc., and can be used directly in our custom components.

The `fumadocs-ui/css/shadcn.css` import makes Fumadocs adopt whatever Shadcn/Ora UI theme variables are already defined — worth exploring when we get there.

---

## Escalation Path: Ejecting Components

If CSS variables and `getMDXComponents` are not enough (e.g. the entire layout or sidebar needs to change), Fumadocs provides a CLI to copy component source directly into the project:

```sh
npx @fumadocs/cli customise   # eject layout components (navbar, sidebar, etc.)
npx @fumadocs/cli add banner  # eject individual named components
```

Once ejected, the component is fully owned by this repo and Fumadocs updates won't affect it. This is a last resort — prefer the `getMDXComponents` override pattern first.

---

## Incremental Rollout Strategy

The intent is to build this out gradually, component by component, as Ora UI's component library grows. The order of priority should roughly be:

1. **Typography** — headings, body text, links (highest visual impact, low effort)
2. **Code blocks** — core to a component library docs site
3. **Tabs** — used heavily in component demos (code vs preview)
4. **Global color tokens** — align `fd-` variables with the Ora UI design tokens
5. **Callouts, Cards** — secondary content components
6. **Layout / Sidebar / Navbar** — only if we need full design ownership (use CLI eject)

Each step should be a focused PR that replaces one component type at a time, keeping the blast radius small.
