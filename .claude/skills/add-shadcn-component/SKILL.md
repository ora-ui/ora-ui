---
name: add-shadcn-component
description: Installs a shadcn component into the Ora UI docs project and scaffolds its documentation. Use when the user wants to add a new component, says "add the X component", or wants to create docs for a new component.
---

# Add Component

## Workflow

### 1. Install via shadcn CLI

Always attempt to install via the CLI first, even if you're unsure a component exists in the shadcn registry. It's much easier to start from an installed base than to build from scratch.

```bash
npx shadcn@latest add <component> --cwd apps/docs
```

**Important**: If the CLI prompts to overwrite existing files, **decline** (answer "no") unless the user has explicitly instructed you to overwrite. Overwriting can introduce shadcn default tokens that are deprecated or incompatible with this project's token system.

If the component does not exist in the shadcn registry, create it manually following the patterns and conventions found in the existing component files.

### 2. Fix `cn` import

Open the installed component file. If the `cn` import path goes through `components/` (e.g. `@/components/lib/utils`), change it to:

```ts
import { cn } from '@/lib/utils';
```

### 3. Register in mdx.tsx

Find the MDX components file (where `getMDXComponents` is defined):

- Add a named import at the top with the other component imports
- Add each exported name to the object returned by `getMDXComponents`

Read the component file first to know exactly what is exported.

### 4. Register in meta.json

Find the components `meta.json` file and add the component slug to the `pages` array in **alphabetical order**.

### 5. Create the MDX doc

Create the MDX doc alongside the other component docs.

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

- Follow the structure of existing component docs in the project
- Live previews go directly in MDX (no wrapper needed) — MDX components are registered globally via `getMDXComponents`
- Examples should be realistic, not toy placeholders
- If the component has meaningful variants, add an `### <Variant>` subsection for each
- Props table goes at the bottom under `## Props`
