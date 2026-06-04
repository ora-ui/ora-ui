# ADR-0005: Schema-driven Playground entries

## Status

Proposed — 2026-05-18

## Context

ADR-0004 collapses Ora's pre-alpha surface to a single Playground at
`/`. That decision raises an architectural question one level down:
what shape does a per-Component **Entry** take?

Today, Entries in `apps/www/playground/entries/` are hand-authored
React. Each Entry imports `SelectControl` / `TextControl`, wires its
own `useState` per prop, decides which controls render, and (would, in
future) hand-roll its code-emission. This works for the existing ~13
Entries but does not scale to ADR-0004's commitments:

- **"Get code" emits a live snippet from current controls state.** With
  hand-authored Entries, every Entry author writes a bespoke
  `toCode()` function. Repetition + drift + bugs.
- **Composer Phase 2** (per `composer-alpha.md` and
  `composer-architecture.md`) needs a structured representation of
  what each Component exposes — for codegen, permalinks, validators,
  and agent consumption. Hand-authored Entries are opaque to all of
  those.
- **Editorial consistency.** The killer-demo bar (ADR-0004) means
  every Entry sits on the homepage. Drift in controls UX across
  Entries is visible.

A schema-driven model fixes all three: the controls renders generically
from a per-Component schema, code is emitted from the same schema
walking current state, and composer Phase 2 inherits the schema as a
seed for its manifest.

The remaining design question is what the schema must express. An
underpowered schema forces a "render override" escape hatch (each
Entry can opt out of the schema and ship bespoke React), which
reintroduces the very problems schema was meant to solve — just
gated.

## Decision

Entries are **schema-only**. No render escape hatch.

The schema models four intrinsic categories of variation: **Appearance**,
**Structure**, **Behavior**, and **Content**. A fifth category,
**Examples**, is extrinsic and out of scope for Entries entirely (see
ADR-0004 and `CONTEXT.md`). The Appearance / Structure / Behavior /
Content taxonomy is defined in ADR-0007 — this ADR's original single
"Variant" umbrella was retired there.

### Framework

| Category       | Intrinsic? | What                                                                                                                                                       | Encoded as                                         | Controls control                                                               |
| -------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Appearance** | yes        | Stylistic CVA branch — decorates a surface. Examples: Button `variant=solid\|soft\|outline\|surface\|ghost`, `size=sm\|md\|lg`, `theme=gray\|accent\|...`. | CVA prop branch on the primitive                   | `<select>` per prop, grouped under "Appearance" in the Controls tab            |
| **Structure**  | yes        | Structural CVA branch — arranges parts. Examples: ToggleGroup `orientation=horizontal\|vertical`, `attached=true\|false`.                                  | CVA prop branch on the primitive                   | `<select>` (or toggle) per prop, grouped under "Structure" in the Controls tab |
| **Behavior**   | yes        | Runtime, non-visual prop — changes behavior without changing CVA. Examples: Accordion `multiple`, DropdownMenu `modal`, exposed `disabled`.                | Plain prop, often forwarded to a Base UI primitive | Switch / select per prop, grouped under "Behavior" in the Controls tab         |
| **Content**    | yes        | What fills the Component's slots/children. Template choice + inputs the template consumes.                                                                 | Slot fills + template options + typed inputs       | Template picker + per-input controls, rendered in a **separate Content tab**   |
| **Example**    | no         | Showcase composition demonstrating a product scenario. Built by composing several Components.                                                              | Hand-authored React (when introduced in v1.1)      | Not part of an Entry — own sidebar section                                     |

### Why no render override

The natural-looking case for an escape hatch — Button's icon-position
"pseudo-prop" — is not actually a missing primitive on Button. Button's
real API is `<Button variant theme size>{children}</Button>`. The
icon-position control is a **children template selector** — it picks
between `<Icon/>Label`, `Label<Icon/>`, just `<Icon/>`, or just
`Label`. This is exactly what the Content category models. Once
Content includes template selection (not just string/enum inputs),
the escape hatch becomes unnecessary on Button — and, by extension,
on the rest of the Components surveyed.

When a future Component genuinely cannot be modelled, the response is
to **extend the schema** (e.g. add a new Content template kind, a new
input type, recursive slot fills), not to fork the Entry into
hand-authored React. This keeps one mental model, one code path, and
one path to composer Phase 2.

### Schema MVP shape (illustrative)

The concrete schema design is a vertical-slice deliverable, not an
ADR-level decision. Sketch for reference:

```ts
type EntrySchema = {
  component: string; // "button"
  variants: Record<string, VariantSpec>; // CVA-encoded enums
  content: ContentSpec; // slot/children model
  defaults: { variants: Record<string, string>; content: ContentState };
  install: { cli: string; manual: string }; // static metadata for "Get code"
};

type VariantSpec = {
  values: string[];
  label?: string;
};

type ContentSpec =
  | { kind: 'text'; defaultLabel?: string }
  | { kind: 'template'; templates: TemplateSpec[] }
  | { kind: 'none' };

type TemplateSpec = {
  id: string; // "leading-icon" | "icon-only" | ...
  label: string;
  inputs?: Record<string, InputSpec>; // e.g. { label: { kind: "string" } }
  sideEffects?: { variant?: Record<string, string> }; // e.g. icon-only forces size="icon"
  render: (inputs: Record<string, unknown>) => React.ReactNode;
  emit: (inputs: Record<string, unknown>) => string; // JSX fragment
};

type InputSpec =
  | { kind: 'string'; default?: string }
  | { kind: 'icon'; default?: string }
  | { kind: 'enum'; values: string[]; default?: string };
```

This sketch is illustrative. Final shape lands during the Button
vertical-slice build.

### State + code emission

The schema is the single source of truth for both:

- **Render:** the Playground walks the schema, reading current state
  (URL params for component state, localStorage for theme), produces
  the preview.
- **Emit:** the same walk produces the JSX snippet for the "Code" tab.

Idempotency rules from `composer-architecture.md` apply: props sorted
deterministically, imports collected from used Components, prettier
as final pass.

### Migration sequencing

ADR-0004 commits to a vertical slice on Button. Concretely:

1. Build the schema runtime + controls generic against Button's
   schema.
2. Author Button's Entry as schema.
3. Ship `/` with Button-only.
4. Port the remaining ~12 existing hand-authored Entries to schema
   one by one.
5. Any new Component lands schema-first.

Step 4 is the cost being deferred to land the demo sooner. Existing
Entries continue to work in their hand-authored form during the
migration — the Sidebar simply omits non-migrated Entries from the
public navigation until they ship in schema form. Alternative
considered: ship all Entries at once. Rejected per ADR-0004 (longer
time-to-demo, no compensating benefit).

## Alternatives considered

### Hand-authored Entries (status quo)

Rejected. Works for the existing 13 but doesn't carry "Get code" with
live snippet emission without per-Entry `toCode()` boilerplate.
Diverges from composer Phase 2 direction.

### Schema with render-override escape hatch

Rejected (was the leading candidate mid-grilling). The motivating
case (Button's icon-position pseudo-prop) turned out to be a Content
template — modellable in schema, not an escape-hatch case. Carrying
an escape hatch "just in case" creates two valid code paths for Entry
authors, which is the exact ambiguity schema was meant to remove.
When a real escape-hatch case appears, the response is to extend the
schema; that work is bounded and the result is reusable.

### Auto-derive schema from TypeScript types

Rejected. Tools like `react-docgen-typescript` get prop shapes for
free, but lose the editorial layer the schema needs: which props are
"interesting" vs noise (`className`, `ref`, `...props`), which
template choices a Component wants in the demo, demo defaults, labels.
The schema is curation, not extraction.

### Hybrid (auto-extract + per-Component override)

Rejected. Cost of building the auto-extract layer dwarfs the cost of
hand-authoring schemas for ~25 Components. Revisit if the Component
count grows past where hand-authoring is comfortable.

## Consequences

**Positive:**

- Single mental model for Entry authors: declare Variants, declare
  Content. No "when do I escape-hatch?" decision.
- "Get code" works automatically for every Entry from day one — no
  per-Entry `toCode()` plumbing.
- Composer Phase 2 inherits the schema as a seed for its manifest.
  Work compounds rather than being thrown away.
- Controls UX is consistent by construction across all Components.
- Schema is the contract that lets agents (composer Phase 3) read and
  manipulate Components without inspecting React code.

**Negative:**

- First Component (Button) carries the cost of designing the schema
  shape against a non-trivial case. Days, not weeks.
- Schema extension becomes a project event when a new Component
  reveals an unmodellable shape. This is the cost of refusing the
  escape hatch — each such case is a real schema-design conversation,
  not a five-minute Entry rewrite. Considered worth it for the single
  code path.
- Existing 13 hand-authored Entries must be ported. Sequence: Button
  first, others on demand. Migration is mechanical; the schema runtime
  is the load-bearing build.
- Schema's `render` and `emit` functions on Templates couple the
  visual surface to the emitted code. Mismatch (preview renders one
  thing, snippet emits another) becomes a real bug class. Mitigation:
  test each Template's render-vs-emit equivalence as part of the
  vertical slice.

## Followups

- Final schema shape — settled during Button vertical-slice build.
  Likely an iteration or two before locking.
- Schema docs for contributors — once the shape settles, a short
  "how to author an Entry" guide replaces the current ad-hoc pattern.
- Composer Phase 2 manifest design — should consume this schema
  directly (or be a strict superset). When Phase 2 is scoped,
  re-read this ADR to make sure the schema didn't drift into a shape
  that closes off Phase 2.
- Examples (v1.1) — separately scoped. Hand-authored React, own
  sidebar section, single-command shadcn registry install. Schema does
  not apply.
