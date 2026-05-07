# Document Component — Reference

## Page structure (button.mdx as canonical example)

```
---
title: Button
description: One-line description.
---

<ComponentPreview name="button-hero" />   ← hero above Installation, no heading

## Installation
  CLI tab: shadcn add command
  Manual tab:
    Step 1 — install deps (CodeBlockTabs with pnpm/npm/bun/yarn)
    Step 2 — <ComponentSource name="<name>" />
    Step 3 — update import paths

## Usage
import { Component } from '@/components/ui/<name>';
<Component>...</Component>;

## Examples

### Variant name          ← h3, sentence case
One-line description.
<ComponentPreview name="<name>-<variant>" />

## API Reference

Compound primitive (thin wrapper, no own props):
For more information, see the Base UI [X API Reference](https://base-ui.com/react/components/x#api-reference).

Component with own props (CVA variants, custom logic, etc.):
| Prop | Type | Default |
| ---- | ---- | ------- |
| ...  | ...  | ...     |

All other props are forwarded to the underlying [Base UI X](https://base-ui.com/components/x) primitive.
```

## Scaffolder reference

```bash
pnpm --filter docs scaffold component <name> "<description>" "<variant1,variant2>"
```

Files generated (all `skipIfExists` for previews + MDX — safe to re-run):

| File                                       | Action                                                                            |
| ------------------------------------------ | --------------------------------------------------------------------------------- |
| `src/previews/<name>/<name>-hero.tsx`      | Created                                                                           |
| `src/previews/<name>/<name>-<variant>.tsx` | Created per variant                                                               |
| `src/previews/registry.ts`                 | Imports + entries inserted before `// @scaffold:imports` / `// @scaffold:entries` |
| `src/components/ui/sources.ts`             | Entry inserted before `// @scaffold:component-entries`                            |
| `content/docs/components/<name>.mdx`       | Created                                                                           |
| `content/docs/components/meta.json`        | Name appended alphabetically                                                      |

## Two preview patterns

### Separate files (default — scaffolded automatically)

Use for distinct scenarios or behavioral modes. Each example is a standalone default-export component in its own file. Name the file and function after the scenario it demonstrates, not a visual style.

```tsx
// accordion-multiple.tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={['item-1', 'item-2']}>
      ...
    </Accordion>
  );
}
```

MDX references each separately:

```mdx
### Default

<ComponentPreview name="accordion-default" />

### Multiple

<ComponentPreview name="accordion-multiple" />
```

### Multi-export + select (manual — use for visual style variants)

Use when variants share the same label text and differ only visually (e.g. solid/outline/ghost). The scaffolder does **not** generate this — it requires manual steps after scaffolding.

1. Rewrite the preview file with named exports:

   ```tsx
   export function Solid() {
     return <Button variant="solid">Sign up</Button>;
   }
   export function Outline() {
     return <Button variant="outline">Sign up</Button>;
   }
   export default Solid;
   ```

2. Update `registry.ts` — add named imports and a `variants` record:

   ```ts
   import ButtonVariantsDefault, {
     Solid as ButtonVariantsSolid,
     Outline as ButtonVariantsOutline,
   } from './button/button-variants';

   'button-variants': {
     component: ButtonVariantsDefault,
     variants: { solid: ButtonVariantsSolid, outline: ButtonVariantsOutline },
     source: readSource('button/button-variants.tsx'),
   }
   ```

3. Add `select` to `<ComponentPreview>` in MDX:
   ```mdx
   <ComponentPreview name="button-variants" select={['solid', 'outline', 'ghost']} />
   ```
   For custom labels: `select={[{ label: 'Leading', value: 'leading' }, ...]}`.

**Rule:** export function name must be the capitalized option value — `"solid"` → `Solid`.
