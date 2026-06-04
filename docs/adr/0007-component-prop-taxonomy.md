# ADR-0007: Component prop taxonomy (Appearance / Structure / Behavior / Content)

## Status

Proposed — 2026-05-30

## Context

Ora components expose a mix of props that, until now, have all been
funnelled through a single umbrella term: **Variant**. CONTEXT.md
defined Variant as "any discrete enum-shaped prop on the primitive —
stylistic, structural, or contextual." ADR-0005 (Schema-driven
Playground entries) inherited that umbrella: Entries declare
`variants` and `content`, and the controls sidebar renders one
`<select>` per Variant prop.

As the component surface has grown, the umbrella has started to hide
intent. Three observations forced a re-think:

- **Stylistic vs structural props are mechanically identical but
  conceptually distinct.** Button's `variant=solid|soft|ghost` and
  ButtonGroup's `orientation=horizontal|vertical` are both CVA branches
  rendered as `<select>` controls. The first changes how the component
  looks; the second changes its shape. Grouping them under one word
  ("Variant") makes the docs read as if they're the same kind of
  decision, when in practice authors reach for them at different times
  for different reasons.

- **Behavior (runtime, non-visual props like Accordion's `multiple` or
  DropdownMenu's `modal`) was already split out** in CONTEXT.md, but
  not surfaced in ADR-0005's schema or the controls sidebar. The split
  exists in language, not in the system.

- **Pattern documentation (Group, Item, Trigger, etc.) needs a
  vocabulary to describe what props a recurring pattern typically
  exposes.** Without category names, pattern docs collapse into "here's
  a flat list of props." With category names, pattern docs can
  meaningfully say "a Group pattern usually has an Appearance prop for
  variant inheritance, a Structure prop for orientation, and a Behavior
  prop for disabled propagation."

The umbrella served its purpose when there were ~13 components and the
Playground was the only consumer. With docs API tables, pattern docs,
and a richer controls sidebar all wanting to speak about prop categories,
the umbrella is now load-bearing in a way it wasn't designed to be.

## Decision

Replace the single **Variant** category with a four-category taxonomy:

| Category       | What                                                                              | Mechanism                                          | Examples                                               |
| -------------- | --------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **Appearance** | Stylistic CVA branch — changes how the component looks                            | CVA prop branch on the primitive                   | Button `variant`, `size`, `theme`                      |
| **Structure**  | Structural CVA branch — changes the component's shape, layout, or arrangement     | CVA prop branch on the primitive                   | ToggleGroup `orientation`, `attached`                  |
| **Behavior**   | Runtime, non-visual prop — changes how the component behaves without changing CVA | Plain prop, often forwarded to a Base UI primitive | Accordion `multiple`, DropdownMenu `modal`, `disabled` |
| **Content**    | What fills the component's slots/children                                         | Slot fills + template options + typed inputs       | Button's "text only" vs "leading icon + text"          |

The word "variant" survives only as the **conventional prop name** for a
component's primary Appearance branch (Button's `variant` prop stays
`variant`). It is no longer a category.

### Where the taxonomy surfaces

The four categories are the single source of truth across:

1. **Playground Entry schema** — each prop declares
   `category: 'appearance' | 'structure' | 'behavior'` (Content is its
   own top-level schema field, as in ADR-0005).
2. **Controls sidebar grouping** — the controls tab renders three
   sections (Appearance, Structure, Behavior) based on schema
   categories. Content is rendered in a separate sidebar tab. Theming
   (a global concern) exits the sidebar entirely and is progressively
   disclosed elsewhere in the Playground chrome.
3. **Component docs API Reference** — props tables are grouped by
   category using `####` subheadings. Skipped when a component has ≤2
   own props.
4. **Pattern documentation** — pattern docs (Group, Item, Trigger, etc.)
   organise their "common props" section under Appearance / Structure /
   Behavior headings to describe what a pattern typically exposes.

One categorisation, four downstream uses. Authors decide a prop's
category once when writing the schema; docs, sidebar, and pattern
references inherit it.

### Distinguishing Appearance from Structure

The mechanical test is identical for both (CVA branch). The
distinguishing question is intent:

- **Appearance** props decorate a surface — fill style, colour
  treatment, density of finish. They operate on the component as a
  single visual surface.
- **Structure** props arrange parts — orientation of children,
  whether items join or separate, stacking direction. They operate on
  how the component's parts compose relative to each other.

Test: _does the prop change how parts arrange, or how a surface is
decorated?_ Arrangement → Structure. Decoration → Appearance.

Structure props are usually purely visual (no semantic change). The
distinction is composition vs decoration, not semantic vs visual. A
flag worth raising during schema review: some Structure props
(e.g. reversing flex order, swapping leading/trailing slots) can
desync DOM reading order from visual order — call those out
explicitly when they appear, since they have downstream accessibility
implications independent of the category they belong to.

## Alternatives considered

### Keep "Variant" as the umbrella with sub-tags

Rejected. Keeping one category name while internally tagging
"stylistic" vs "structural" preserves the ambiguity the rename is
meant to fix. Docs would still read "Variant" at the heading level,
and the sub-tags would be invisible to anyone scanning. The whole
point of the change is to make the split visible to the reader.

### Two categories: functional vs stylistic

Rejected. This was the user's opening framing. It collapses Behavior
into "functional" alongside Structure, which would put `orientation`
(CVA branch, schema-renderable as `<select>`) in the same bucket as
`multiple` (plain boolean, no CVA). The schema and sidebar renderer
need to treat those differently — they aren't the same kind of prop.
Four categories is the smallest split that keeps mechanically-distinct
props in different buckets.

### Defer the rename until pattern docs land

Rejected. Pattern docs and the category names co-evolve — writing
pattern docs without category language produces flat prop lists that
won't survive the rename. Better to land the taxonomy first and write
pattern docs against stable vocabulary.

## Consequences

**Positive:**

- Pattern docs (forthcoming) have a vocabulary for describing what a
  recurring pattern typically exposes, grouped by category.
- Controls sidebar grouping is derived from schema categories — no
  duplicated grouping logic between sidebar and docs.
- Component docs API tables read the same way the sidebar reads, which
  is the same way pattern docs read. Three surfaces, one taxonomy.
- Appearance vs Structure makes the "is this a styling decision or a
  layout decision?" call explicit at schema-authoring time, when the
  author has the most context.

**Negative:**

- Every existing Entry schema needs a one-time pass to assign
  categories to its existing Variant props. Mechanical, but it's work.
- Appearance vs Structure is a judgment call at the margins. Some
  props (e.g. a hypothetical `density` prop that changes spacing) sit
  on the boundary. The "intent" test (form vs finish) resolves most
  cases; ambiguous cases will need a convention to default to one
  side. Defer until a real ambiguous prop appears.
- The old word "Variant" now has two meanings: the conventional prop
  name (kept) and the retired category name (gone). Onboarding docs
  must call this out explicitly to avoid confusion.

## Followups

- Update ADR-0005's "Framework" table to reflect Appearance / Structure
  / Behavior / Content instead of Variant / Content / Example. Example
  remains out of scope for Entries — that part of ADR-0005 is unchanged.
- Update `docs/conventions/INDEX.md` props section to name the four
  categories.
- Update `docs/conventions/COMPONENT-DOCS.md` API Reference convention
  to require category subheadings.
- Create `docs/patterns/` tree at the repo root (sibling to
  `docs/conventions/` and `docs/adr/`) for pattern documentation. In
  pre-alpha, pattern docs are contributor/agent-facing only — they
  inform how components get built, which is not yet a user concern.
  Promote to user-facing docs (frontmatter chips on Component docs,
  reverse index per pattern) at stable release once patterns have
  stabilised. First pattern docs to write: Group and Item. Trigger,
  Content/Panel, Field deferred until they earn the doc.
- Decide default-side convention for ambiguous Appearance/Structure
  props when a real case appears.
- Forwarded / passthrough props (`className`, `ref`, `aria-*`, Base UI
  forwards) are intentionally **not** modelled by the four-category
  taxonomy and not represented in the Entry schema — Playground does
  not control them. Docs continue to rely on the existing
  "All other props are forwarded to the underlying Base UI primitive"
  footer. Revisit when a notable forwarded prop (e.g. polymorphism
  via `render`) earns its own callout block in the docs page.
- Retire the "Documenting the interface" section in
  `docs/conventions/INDEX.md` that prescribes a JSDoc block on each
  component file listing CSS custom properties and slots. Users own
  the source after install — the block is clutter in the consumer's
  codebase. Move that information to the component's docs page (likely
  a small section inside or alongside API Reference).
