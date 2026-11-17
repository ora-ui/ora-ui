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
     Take them from the issue's Docs examples or the caller's list. If
     none are given, draft them from [Default examples](#default-examples).
     From an issue, use the draft and list it in the PR. Otherwise show
     it and let the user correct it.
   - **Which examples use `select`.** A `(select)` mark in the list
     answers it. Otherwise ask; don't infer. See
     [REFERENCE.md](REFERENCE.md#interactive-previews-select).

5. **Scaffold** non-interactively:

   ```bash
   pnpm --filter www scaffold docs <name> "<description>" "<example1,example2>"
   ```

   Every argument is required. It creates the hero, one preview file
   per example and the MDX page, and leaves any file that exists alone.
   After `scaffold component` the page and the variant previews exist,
   so it only adds the other examples' previews. Add their `###`
   sections to the MDX by hand. The
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

## Default examples

When no examples are given, draft these in order:

1. `hero`: the most common product use, in the default appearance.
2. The variants: one example per variant, as `scaffold component`
   writes them, or one `variants (select)` example when they share
   their content.
3. `theme (select)`, if the component has a `theme` prop.
4. Each demo on the primitive's Base UI page, named by its scenario
   and rebuilt with Ora parts. Skip any that repeat an example above.

## Example content

Every preview shows the component the way a real product uses it,
whether the examples came from an issue, a caller or the defaults.

- Start from the Base UI demo for the primitive. Keep its scenario and
  the parts it pairs: Progress shows a label ("Export data") beside its
  value ("64%"), not a bare bar.
- Write real copy for one concrete scenario: "Sign up", "Featured",
  "Uploading report.pdf". Never "Label", "Item 1", "Option A",
  "Click me" or lorem ipsum.
- Keep one scenario across a `select` example's options, so they
  compare like for like (every Button variant reads "Sign up").
- An example the list names without content ("a hero") still gets
  content from these rules. Don't ask for it.

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
