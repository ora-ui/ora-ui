---
name: document-component
description: Scaffolds and fills the docs page for an existing Ora UI component, or restructures an existing docs page to follow current conventions. Use when the user asks to document, add docs for, create, or update the docs page for a UI component — e.g. "document the accordion", "add docs for dialog", "update the button-group docs".
---

# Document Component

## Procedure

1. **Verify** — check `apps/docs/src/components/ui/<name>.tsx` exists. If not, suggest `build-component` instead.

2. **Check for existing docs** — check if `content/docs/components/<name>.mdx` exists.
   - **Exists → update path**: read the existing MDX and restructure it to follow current conventions (add `## Examples` wrapper, demote example headings from `##` to `###`, replace any inline code blocks with `<ComponentPreview>`, ensure `## API Reference` follows the API Reference convention). Then ask the user which examples (if any) should use the `select` pattern for interactive variant switching before touching any preview files. Skip to step 6.
   - **Does not exist → new path**: continue to step 3.

3. **Read the component** — read the source to understand its prop surface and sub-components.

4. **Gather inputs** (ask if not provided):
   - One-line description for the MDX frontmatter
   - Examples to showcase (e.g. `default,multiple`). Each example becomes a separate preview file and `### Example` section. Name them by the scenario they demonstrate, not by visual style.
   - **Which examples should be interactive?** Ask the user which examples (if any) should use the `select` pattern to switch between visual variants. Don't infer this — prompt explicitly. Singular examples (e.g. icon-only) and polymorphic examples (e.g. as-a-link) typically don't need it; visual style variant groups typically do. See the Interactive previews convention in [COMPONENT-DOCS.md](../../../../docs/conventions/COMPONENT-DOCS.md).

5. **Scaffold** — run non-interactively, passing example names as the variants argument:

   ```bash
   pnpm --filter docs scaffold component <name> "<description>" "<example1,example2>"
   ```

   Generates preview files, registry entries, `sources.ts` entry, and the MDX page. See [REFERENCE.md](REFERENCE.md) for the full file list.

6. **Fill preview TODOs** — for each `src/previews/<name>/<name>-<example>.tsx`, replace the TODO with real JSX derived from the component source. Follow the instance count convention (see Conventions below).

   **If any preview uses the `select` pattern** (new or update path): also update `src/previews/registry.ts` — change the default import to named+default imports, and add a `variants` map to the registry entry. The `select` prop on `<ComponentPreview>` is non-functional without this.

   ```ts
   // imports
   import BadgeVariantsDefault, {
     Solid as BadgeVariantsSolid,
     Soft as BadgeVariantsSoft,
   } from './badge/badge-variants';

   // registry entry
   'badge-variants': {
     component: BadgeVariantsDefault,
     variants: { solid: BadgeVariantsSolid, soft: BadgeVariantsSoft },
     source: readSource('badge/badge-variants.tsx'),
   },
   ```

   **Select pattern footgun — every variant needs a named export.** `ComponentPreview` uses `extractExport(source, 'Soft')` to extract the code snippet for each variant. It scans the source file for `export function Soft(` literally — a default export never matches. If you map a variant key to the default export (e.g. `soft: MyDefault`), that variant's code block will be silently empty. Always give every variant its own named `export function`, including the first/primary one, and set the default export to one of them:

   ```ts
   // preview file — correct
   export function Soft() { ... }   // named — extractExport finds this
   export function Solid() { ... }  // named — extractExport finds this
   export default Soft;             // default just sets the initial render

   // preview file — wrong: default export is invisible to extractExport
   export default function MyVariants() { ... }  // "soft" key → no code block shown
   export function Solid() { ... }
   ```

7. **Fill MDX TODOs** — in `content/docs/components/<name>.mdx`:
   - Replace the usage snippet (import + minimal JSX)
   - Add a one-line description above each `<ComponentPreview>`
   - Fill the `## API Reference` section — see API Reference convention below

8. **Typecheck**:

   ```bash
   pnpm --filter docs typecheck
   ```

9. Report what was created or changed. Ask the user to spot-check in dev.

## Conventions

Full conventions are in [docs/conventions/COMPONENT-DOCS.md](../../../../docs/conventions/COMPONENT-DOCS.md). Quick reference:

- Page order: Hero → Installation → Usage → Examples (`### per example`) → API Reference
- Hero sits above Installation with no heading; `<ComponentPreview>` never has inline code children
- Manual install step 2 uses `<ComponentSource name="..." />`, never pasted source
- **Compound primitive** (thin Base UI wrapper, no own props): replace API Reference section with a single link to the Base UI API Reference
- **Own props** (CVA variants, custom logic): full table per sub-component, ending with a forwarding note
- **Preview instance count**: the hero preview may render multiple component instances or include additional markup (e.g. a badge composed with a label, or several representative states side by side). Every other preview — including each export in a select — renders a single component instance. Don't show a row of three badges to demonstrate the `soft` variant; show one.

## What NOT to do

- Don't create files the scaffolder generates — always run the scaffolder first
- Don't paste preview source into MDX as a code block
- Don't run the dev server or take screenshots
