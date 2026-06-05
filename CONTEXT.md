# Context

Domain language for the Ora UI project. Keep terms here only if they
have meaning to a domain expert (a user of Ora, a contributor reasoning
about its product surface). Implementation details belong in code.

## Terms

### Registry

The publishable surface of Ora UI: the set of components installable via
the shadcn CLI, plus their metadata. Ora ships as a shadcn-compatible
registry (not copy-paste only).

In the codebase, `registry/` (the slice) holds the components and the
metadata that defines what an external consumer can install.

Do not use "registry" to mean "any index data structure." See **Index**.

### Index

A generated lookup table used internally by the docs app to map a slug
to a renderable thing. The previews index (`previews/index.generated.ts`)
maps preview slugs to components and snippets. Indexes are an
implementation detail of the docs app — they are not part of the
Registry.

### Preview

A small, self-contained example of a Registry component, rendered inline
on a docs page via `<ComponentPreview />`. One preview file may export
several named functions, each shown as a tab.

### Playground

The interactive surface where a user explores Components before
installing: pick a Component (or the Introduction page) from the
left nav sidebar, see it rendered in the center, manipulate its props
via the right-side **controls sidebar**. The controls sidebar exposes
props only — CSS-variable knobs and data-slot overrides are not part
of the pre-alpha demo surface.

In pre-alpha, the Playground _is_ the site — it lives at `/` and
replaces both a separate marketing Landing and the `/docs` surface.
The sidebar carries an Introduction entry that doubles as the
project's intro/install page.

Theme controls (dark/light, accent picker, radius preset) live in the
**app-level header**, not inside the Playground's per-component
controls sidebar. Changing them re-themes the entire site — chrome
included — intentionally. Placement signals scope: header = global,
controls sidebar = this component only. Accent options are a hand-picked set that
chrome design has been validated against.

Distinct from a Preview (preview = curated inline example,
playground = exhaustive control surface).

### Component

A single unit of the Registry — e.g. Button, Dialog, DropdownMenu. Each
Component has Previews and a Playground entry.

### Playground Entry

A per-Component artifact that drives its Playground page. An Entry is
a **schema** (declarative description of the Component's variants and
content shape) — the controls sidebar renders generic controls from it and the
code snippet is emitted automatically from current state. No bespoke
React render escape hatch: anything intrinsic to the Component must be
expressible via Variants + Content (see those terms). If something
cannot be expressed, the schema model is extended; the Entry never
forks into hand-authored React.

Lives in `apps/www/playground/entries/`.

### Appearance

A stylistic CVA prop branch — changes how a Component looks without
changing its structure or behavior. Examples: Button's
`variant=solid|soft|...`, `size=sm|md|lg`, `theme=gray|accent|...`.
The conventionally-named `variant` prop is always an Appearance prop,
but Appearance covers any stylistic enum (size, theme, tone, etc.).
Controls sidebar groups Appearance props together.

### Structure

A structural CVA prop branch — changes a Component's shape, layout, or
arrangement without changing what it is. Examples: ToggleGroup's
`orientation=horizontal|vertical` and `attached=true|false`; ButtonGroup's
`orientation`. Mechanically identical to Appearance (CVA branch,
`<select>` in the controls sidebar) but conceptually distinct: Structure
props alter form, Appearance props alter finish. Grouped separately in
the controls sidebar.

Together, Appearance + Structure replace the older umbrella term
"Variant" as a props category. The word "variant" survives only as the
conventional prop _name_ for a Component's primary Appearance branch.

### Behavior

A discrete prop on a Component that changes its runtime behavior without
changing its visual appearance — i.e. not a CVA branch. Examples:
Accordion's `multiple` (single- vs multi-open), DropdownMenu's `modal`,
form fields' `disabled` when exposed as a demo control. Distinct from
[[Variant]] (which alters styling via CVA) and [[Content]] (which fills
slots/children). Controls sidebar renders Behavior props in their own
section, mechanically similar to Variants (one control per prop).

### Content

What fills a Component's slots/children. Parametric within typed
bounds: template choices (e.g. for Button, "text only" vs "leading
icon + text" vs "icon only") plus inputs the chosen template consumes
(e.g. label text, icon identifier). Distinct from Variants — Variants
are props the Component exposes; Content is what gets passed into the
Component. Controls sidebar renders a template picker plus inputs.

### Example

A showcase composition demonstrating the system in a real product
context (e.g. a settings panel, an onboarding step, a billing form).
Extrinsic to any single Component — built by composing several. Lives
in the Playground sidebar as its own section (when shipped — deferred
to v1.1). Hand-authored React, not schema-driven; the point of an
Example is to show a finished composition, not to let users tweak it.
Examples are product surface, not docs — they demonstrate the system's
versatility independent of any per-component reference material.

Distinct from "lookalike" clones of third-party UIs (Notion, Raycast);
Examples are pattern-focused, not brand-focused.

### Slice

A top-level directory under `apps/www/` that owns a product surface
end-to-end: its UI, its data, its content. Slices are siblings to
`app/` (the Next.js route tree). Routes inside `app/` are thin shells
that import from slices.

Current slices: `docs/`, `playground/`, `registry/`, `landing/`,
`shared/`. Layout helpers used by exactly one route layout do not
qualify as slices and sit as direct siblings to that layout file
(e.g. `app/header.tsx` next to `app/layout.tsx`).

### Landing

Retired in pre-alpha. The root route (`/`) serves the [[Playground]]
directly — there is no separate marketing surface. The `landing/`
slice is being absorbed into `playground/`. Revisit post-alpha if a
dedicated marketing page is warranted.

### Manifest

The `registry.json` file at `apps/www/` root — the shadcn-compatible
index of every distributable Registry entry (components, lib utilities,
theme). Generated by `gen-manifest.ts`; consumed by `shadcn build` to
produce the per-component JSON files in `public/r/`.

Do not confuse with the Index (docs-internal lookup) or with `public/r/`
(the built output of the Manifest).

### Registry Entry

One item in the Manifest — describes a single distributable unit: its
name, type (`registry:ui`, `registry:lib`, `registry:theme`), npm
dependencies, registry dependencies, and source file paths.

One special entry exists outside `registry/ui/`:

- `utils` (`registry:lib`) — ships `registry/lib/utils.ts`; auto-inferred
  as a `registryDependency` for any component that imports `@/registry/lib/utils`

Token/theme distribution is documented, not enforced via registryDependencies,
to allow incremental adoption without requiring consumers to adopt Ora's token system.

### Semantic layer

The middle tier of Ora's three-tier token architecture ([[Scale]] →
Semantic layer → component vars). A small, fixed-shape set of named
roles — backgrounds, surfaces, ui strengths, solids, borders, ring,
foregrounds — that components actually read. Components never reach
into the Scale directly; they read semantic roles, and the roles map
onto Scale steps. A theme reimplements this layer to swap aesthetics
while the role names and their intent stay constant.

See `docs/conventions/TOKEN-SYSTEM.md` for the full role list and
naming convention.

### Scale

The palette tier of the three-tier token architecture — raw step
values per hue (e.g. `--gray-*`, `--accent-*`). Pure values, no
intent. A theme is a Scale implementation: it supplies the step values
that the [[Semantic layer]] maps onto. New themes plug in by providing
Scale values for the same set of roles rather than forking the
component set.

See `docs/conventions/TOKEN-SYSTEM.md` for how Scales back the
semantic roles.
