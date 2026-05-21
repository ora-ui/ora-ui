# ADR-0006: Playground vertical shape — single implementation, conventional folders

## Status

Proposed — 2026-05-21

## Context

ADR-0004 collapsed three product surfaces into one (Playground at `/`).
ADR-0005 committed to schema-only Entries. Together they describe the
target system.

Implementation landed those decisions incrementally, leaving the slice
in a transitional shape:

- **Two parallel implementations** of the Playground co-existed under
  `apps/www/playground/`: the legacy hand-authored Entries (with their
  own controls module, sidebar, preview shell, and dynamic loader)
  serving `/playground/<component>`, and the new schema runtime
  serving `/`. Issue #197 (closed) explicitly built the new "alongside"
  the legacy to defer the migration cost — see ADR-0005 §migration
  sequencing.
- **A `schema/` subdirectory** inside the slice that grouped types +
  registry + a 168-line `runtime.tsx` mixing URL-param glue, preview
  rendering, and the right-side controls UI. The name "schema"
  duplicated a domain term that already belongs in the ubiquitous
  language ([[Playground Entry]] is a schema); folder placement made
  the controls UI hard to discover (it lived in `runtime.tsx`).
- **A `constants.ts` of per-Component enum mirrors** that the schema
  already encodes via `variants[*].values` — drift hazard, no longer
  load-bearing.
- **View composition outside the slice:** the sidebar + nav UI lived
  in `apps/www/app/playground-home.tsx`, violating the
  thin-shell-routes contract from [[Slice]] (see also issue #256).

The walking-into-it experience matched the dual structure: opening
the Playground slice did not make the system legible. Two
implementations, one of them named with domain terms, neither
following the rest of the codebase's per-vertical conventions.

## Decision

Single implementation. Conventional per-vertical folders. Domain
terms stay in CONTEXT.md, not in folder names.

### 1. One Playground implementation

The legacy hand-authored surface is deleted in full:

- `apps/www/app/playground/` (legacy routes)
- `apps/www/playground/entries/{accordion,alert-dialog,avatar,
avatar-group,badge,button-group,checkbox,checkbox-group,
dropdown-menu,input,input-group,tabs}.tsx`
- `apps/www/playground/components/{component-loader,controls,
global-controls,playground-sidebar,preview-shell,constants}.{ts,tsx}`
- `apps/www/playground/schema/` (whole subtree)
- `apps/www/playground/index.ts` (barrel removed — `app/page.tsx`
  imports `@/playground/components/layout` directly)

Button is reauthored under the new shape. The sidebar lists
Introduction + Button until each remaining Entry is re-authored as a
schema (issue #205). This is consistent with ADR-0004 §8 ("Ship `/`
with Button-only and a 'more components coming' affordance").

### 2. Folder shape

```
apps/www/playground/
├── components/
│   └── layout.tsx          PlaygroundLayout: nav-sidebar + shell
│                          + preview area + controls sidebar.
│                          Split a sub-component out only when it
│                          grows its own state machine or exceeds
│                          ~80 lines.
├── hooks/
│   └── use-entry-state.ts  useEntryState: URL ↔ state via nuqs,
│                          parsers built from the schema.
├── lib/
│   └── types.ts            EntrySchema, VariantSpec, InputSpec,
│                          ContentSpec, EntryState. Code emit
│                          (when #203 lands) co-locates here or
│                          gets its own `lib/emit.ts` — see §3.
├── entries/
│   ├── button.tsx          Schema for the Button Entry.
│   └── index.ts            Registry array + getEntryBySlug helper.
```

No `playground/index.ts` barrel. The only consumer is
`app/page.tsx`, which imports `@/playground/components/layout`
directly. A barrel would imply other verticals can import from
playground, which is not the case in pre-alpha.

No `schema/` directory. "Schema" is the type name (`EntrySchema`)
and a domain term ([[Playground Entry]] in CONTEXT.md), not a folder.

### 3. Schema-walker placement

Walkers of the schema tree (the URL-state hook today; the code-emit
function when #203 lands) live close to the types in `lib/types.ts`
that they walk. When the schema shape grows (a new `InputSpec` kind,
a new template type), the walkers must change in lockstep or the
snippet diverges from the preview — the ADR-0005 §Consequences
mismatch hazard.

Today only one walker exists (the hook), so it sits in `hooks/`
beside the types in `lib/`. When emit arrives, it lives in `lib/`
(it is not a hook). If a second non-hook walker appears, co-locate
or split per the "wild" threshold — exports stay stable, splits
are cheap.

### 4. Header theme controls — parked

ADR-0004 §3 places dark/light, accent, and radius controls in the
app-level header (shared chrome), but they are meaningful only on
the Playground route. This creates a real cross-slice tension:
should they live in `playground/components/` (semantically
Playground-owned) or `app/` chrome (where they render)?

Deferred. The implementation question is bound up with issues
#201 / #204 (which build those controls); we will decide placement
when one of those is picked up. The Playground slice ships without
header theme controls until then.

### 5. Naming: "controls sidebar", not "toolbar"

The right column was historically labeled "Toolbar" in ADR-0004
and CONTEXT.md. It is a sidebar, not a toolbar, and renaming it
clarifies symmetry with the left "nav sidebar". The term is
swept through ADR-0004, ADR-0005, and CONTEXT.md in the same
change.

## Alternatives considered

### Port legacy entries first, then delete

Rejected. Keeping two implementations alive during the port _is_
the confusion that motivated this ADR. Legacy entries are not
delivering visitor value at `/<component>` today (per ADR-0004 §1
the public surface is `/`); the legacy routes were scaffolding for
the migration. Re-authoring them as schemas is open work (issue
#205) but does not require the legacy surface to remain mounted.

### Peer-vertical mimicry (`components/ + lib/ + previews/` like `docs/`)

Rejected. Other verticals' folder shapes follow their own context
([[Slice]]) — `docs/` has `previews/` and `content/`; `registry/`
has `lib/ ui/ theme/`. No project-wide convention exists. The
Playground's domain folder is `entries/`, sized to its actual
content.

### Single co-located `lib/entry.ts` (types + hook + emit)

Rejected. Hooks live in `hooks/` by project convention (separate
from non-hook lib code), so the URL-state hook does not belong
beside the types regardless of the lockstep argument. With the hook
extracted, what remains in `lib/` is types-only today — named
`types.ts` for precision. A future `lib/utils.ts` can hold utility
functions when they arrive; emit (when #203 lands) goes in `lib/`
beside the types it walks.

### Keep view composition in `app/playground-home.tsx`

Rejected. Conflicts with [[Slice]] definition ("Routes inside
`app/` are thin shells that import from slices"). Composition now
lives in `playground/components/layout.tsx`; `app/page.tsx` is a
2-line shell that renders it inside `<Suspense>`. Partial close on
issue #256.

## Consequences

**Positive:**

- One mental model when opening the Playground slice. Five files,
  conventional names, each with a clear role.
- The slice's vocabulary matches CONTEXT.md exactly: "Entry",
  "controls sidebar", "nav sidebar". No folder named after a domain
  term, no domain term hidden behind a non-domain name like
  "runtime".
- Adding a Component is one file (`entries/<name>.tsx`) + one
  import in `entries/index.ts`. No edits to `lib/` or `components/`.
- Schema shape evolution touches `lib/types.ts`,
  `hooks/use-entry-state.ts`, and `components/layout.tsx` —
  bounded set, all in this slice.
- `app/page.tsx` becomes a thin shell. Closes part of #256.

**Negative:**

- Sidebar shrinks to Introduction + Button until #205 re-authors
  the remaining 12 Entries. Bounded — ADR-0004 §8 already accepted
  this as the demo's starting state.
- Old URLs `/playground/<component>` 404. No external consumers in
  pre-alpha (per ADR-0004 §Consequences); not a real cost today.
- Schema-walker lockstep is now a discipline, not a single-file
  guarantee — the hook and (future) emit live in different files.
  Mitigated by both living inside this slice and being touched
  together when types change.

## Followups

- **Nav sidebar → real navigation.** Current implementation is
  `<button>` + URL query param, which means no route change, no
  focus management, no screen-reader announcement when the preview
  swaps. Per ADR-0004 §1, `/` stays Introduction and per-Component
  pages move to `/<component>` — sidebar items become `<Link>` with
  `aria-current="page"`, Next App Router's route announcer handles
  the SR announcement, and `?c=` collapses. Deferred from the
  restructure session to keep scope contained.
- #205 — re-author the remaining 12 Entries as schemas.
- #201 / #204 — decide header theme controls placement when picked
  up (see §4).
- #203 — add the code-emit function in `lib/entry.ts` and a
  `get-code-popover.tsx` in `components/` when "Get code" is built.
- #256 — finish the relocation of view composition into verticals
  for other slices.
