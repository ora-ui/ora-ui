---
name: document-component
description: Scaffolds and fills the docs page for an existing Ora UI component, or restructures an existing docs page to follow current conventions. Use when the user asks to document, add docs for, create, or update the docs page for a UI component — e.g. "document the accordion", "add docs for dialog", "update the button-group docs".
---

# Document Component

All paths are relative to `apps/www/`.

## Procedure

1. **Verify**: check `registry/ui/<name>.tsx` exists. If not, suggest
   `build-component` instead.

2. **Check for existing docs** at `docs/content/components/<name>.mdx`.
   - **Exists (update path)**: read it and restructure it to the page
     conventions below (`## Examples` wrapper, `###` example headings,
     `<ComponentPreview>` instead of inline code, API Reference
     convention). Ask which examples should use the `select` pattern
     before touching preview files. Skip to step 6.
   - **Doesn't exist (new path)**: continue.

3. **Read the component** to learn its parts and own props. If it has a
   playground entry (`playground/entries/<name>.tsx`), use its prop
   categories for the API Reference grouping.

4. **Gather inputs** (ask for anything not provided):
   - A one-line description for the frontmatter.
   - The examples to show, named by scenario (`multiple`, not
     `expanded-state`). Each becomes a preview file and a `###` section.
   - **Which examples use `select`.** Ask; don't infer. See
     [REFERENCE.md](REFERENCE.md#interactive-previews-select).

5. **Scaffold** non-interactively:

   ```bash
   pnpm --filter www scaffold component <name> "<description>" "<example1,example2>"
   ```

   This creates the hero and example preview files and the MDX page. The
   docs `meta.json` is generated from the MDX files (`pnpm gen:lists`,
   gitignored), so don't edit it. It doesn't touch any registry file; those are
   generated (step 8).

6. **Fill the previews** in `docs/previews/<name>/`. Replace each TODO
   with real JSX from the component source. Naming rules (enforced by
   the generator):
   - Every exported function starts with the directory's PascalCase name
     (`docs/previews/button/` → `Button…`).
   - Every file has a default export.
   - For a `select` example, export one function per option; the option
     value is the kebab-case suffix (`ButtonSolid` → `"solid"`). See
     [REFERENCE.md](REFERENCE.md#interactive-previews-select).

   Only the hero may render several instances or extra markup. Every
   other preview, including each `select` option, renders one instance.

7. **Fill the MDX**:
   - Add `links.doc` and `links.api` to the frontmatter when the
     component wraps a Base UI primitive.
   - Fill in the usage snippet (import from `@/registry/ui/<name>` plus
     the minimal part tree).
   - Add a one-line description above each `<ComponentPreview>`.
   - Write the API Reference (see conventions below).

8. **Generate and check**:

   ```bash
   pnpm --filter www gen:registry
   pnpm --filter www typecheck
   ```

   `gen:registry` rebuilds `docs/previews/registry.generated.ts` and
   `registry/lib/sources.generated.ts` and fails on naming violations.
   Don't edit the generated files.

9. **Report** what was created or changed and ask the user to check the
   page in dev.

## Page conventions

Order: hero preview (no heading) → `## Installation` → `## Usage` →
`## Examples` (one `###` per scenario, sentence case) →
`## API Reference`.

- **Installation**: CLI and Manual tabs, from the template. Manual step 2
  is `<ComponentSource name="<name>" />`, never pasted source.
- **Usage**: code only, no prose.
- **`<ComponentPreview>`** never has children; the preview file renders.
- **API Reference**:
  - **Thin Base UI wrapper with no own props**: one line linking to the
    Base UI API Reference instead of a table.
  - **Own props**: a `###` section per part with own props, a
    `| Prop | Type | Default |` table, grouped under `####` Appearance /
    Structure / Behavior headings
    ([ADR-0007](../../../docs/adr/0007-component-prop-taxonomy.md)).
    Skip the `####` headings when a part has two or fewer own props.
    Content props aren't listed.
  - End with "All other props are forwarded to the underlying
    [Base UI X](https://base-ui.com/react/components/x) primitive."
  - Document notable CSS custom properties and `data-slot` names here
    too, since components carry no header comment block.

See [REFERENCE.md](REFERENCE.md) for a page skeleton and preview
examples.

## Don't

- Create files the scaffolder generates; run it first.
- Edit `registry.generated.ts` or `sources.generated.ts`.
- Paste preview source into the MDX.
- Run the dev server or take screenshots.
