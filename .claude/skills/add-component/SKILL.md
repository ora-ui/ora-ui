---
name: add-component
description: Installs a shadcn component into the Ora UI docs project and scaffolds its documentation. Use when the user wants to add a new component, says "add the X component", or wants to create docs for a new component.
---

# Add Component

## Workflow

### 1. Install via shadcn CLI

```bash
npx shadcn@latest add <component> --cwd apps/docs
```

### 2. Fix `cn` import

Open the installed file at `apps/docs/src/components/ui/<component>.tsx`.

If the `cn` import path goes through `components/` (e.g. `@/components/lib/utils`), change it to:

```ts
import { cn } from '@/lib/utils';
```

### 3. Register in mdx.tsx

In `apps/docs/src/components/mdx.tsx`:

- Add a named import at the top with the other component imports
- Add each exported name to the object returned by `getMDXComponents`

Read the component file first to know exactly what is exported.

### 4. Register in meta.json

In `apps/docs/content/docs/components/meta.json`, add the component slug to the `pages` array in **alphabetical order**.

### 5. Create the MDX doc

Create `apps/docs/content/docs/components/<component>.mdx`.

Before writing, read the component source to understand its props, variants, and sub-components.

Use this structure:

````mdx
---
title: Component Name
description: One sentence describing what it does.
---

## Installation

\```bash
npx shadcn@latest add "https://ora-ui.com/r/<component>.json"
\```

## Usage

\```tsx
import { Component } from '@/components/ui/<component>';

<Component />
\```

## Examples

### Default

<Component />

\```tsx
import { Component } from '@/components/ui/<component>';

export default function ComponentDefault() {
  return <Component />;
}
\```
````

## Conventions

- Follow the structure of existing docs: [separator.mdx](../apps/docs/content/docs/components/separator.mdx), [button-group.mdx](../apps/docs/content/docs/components/button-group.mdx)
- Live previews go directly in MDX (no wrapper needed) — MDX components are registered globally via `getMDXComponents`
- Examples should be realistic, not toy placeholders
- If the component has meaningful variants, add an `### <Variant>` subsection for each
- Props table goes at the bottom under `## Props`
