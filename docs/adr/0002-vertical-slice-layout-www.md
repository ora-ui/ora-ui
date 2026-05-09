# ADR-0002: Vertical slice layout for the www app

## Status

Accepted — 2026-05-09

## Context

The docs app (currently `apps/docs/`) had grown a layout that scattered
related concerns across multiple top-level directories:

- MDX content lived in `content/docs/`
- MDX-rendering components lived in `src/components/`
- Route-scoped docs UI lived in `src/app/docs/components/`
- Preview files lived in `src/previews/`
- Layout components lived in `src/app/layout/`
- Shared utilities lived in `src/lib/` (a grab-bag of four unrelated files)

A contributor or agent working on a docs problem had to know all four
locations to find the relevant code, with no structural signal pointing
to the right one.

The existing app name (`docs`) was also misleading: the app contains
documentation (`/docs`), an interactive playground (`/playground`), a
landing page (`/`), and a search API (`/api/search`). It's a website,
not just docs.

We considered three structural improvements together: rename the app,
remove the `src/` indirection, and group code semantically instead of by technical role.

## Decision

### Rename the app

`apps/docs/` → `apps/www/`. The app is the website; documentation is
one slice within it. CONTEXT.md term: **App = www**.

### Drop `src/`

Code moves directly to the package root. No `apps/www/src/` indirection.
Rationale: `src/` adds a directory level without grouping anything; the
slice structure provides the actual grouping signal.

### Slice structure

Top-level directories under `apps/www/` are either Next.js routing
(`app/`), framework support (`public/`, `scripts/`, `templates/`,
`tests/`, configs), or a **Slice**. A Slice owns a product surface
end-to-end: its UI, its content, its data.

Current slices:

```
apps/www/
├── app/                       ← Next.js routes (thin shells)
│   ├── layout.tsx
│   ├── page.tsx               ← thin shell, imports from landing/
│   ├── header.tsx             ← used by layout.tsx
│   ├── search-dialog.tsx      ← used by header (UI only; data via docs/search.ts)
│   ├── mode-switcher.tsx      ← used by header
│   ├── logo.tsx               ← used by header
│   ├── layout-config.tsx      ← used by layout.tsx
│   ├── globals.css
│   ├── colors.css
│   ├── layout.css
│   ├── api/
│   ├── docs/[[...slug]]/page.tsx
│   └── playground/[component]/page.tsx
├── docs/                      ← documentation slice
│   ├── content/               ← MDX (moved from apps/docs/content/docs/)
│   ├── components/            ← flat: callout, steps, code-block,
│   │                            mdx, component-preview, component-source, ...
│   ├── previews/              ← preview files + index.generated.ts
│   ├── source.ts              ← fumadocs source loader
│   └── search.ts              ← search query logic (route shell in app/api/)
├── playground/
│   ├── components/            ← flat
│   └── entries/               ← was app/playground/registry/
├── registry/                  ← per ADR-0001
│   └── ui/
├── landing/                   ← home/marketing surface
├── shared/                    ← cn (and only cn, by default)
├── public/
├── scripts/
├── templates/
└── tests/
```

Layout components used by exactly one route layout do **not** qualify
as slices. Header, search dialog UI, mode switcher, logo, and layout
config are colocated with `app/layout.tsx` as direct siblings inside
`app/`. Next.js treats folders + reserved filenames (`page.tsx`,
`layout.tsx`, `route.ts`) as routing; loose `.tsx` files at `app/`
root are not routes.

### Thin-shell rule

Route files (`page.tsx`, `layout.tsx`, `route.ts`) own:

- Next.js exports (`metadata`, `generateMetadata`,
  `generateStaticParams`, `revalidate`, `fetchCache`)
- Provider setup
- Param parsing, request handling
- Composing slice content + layout components into the layout structure

Slices own:

- The content rendered (the actual sections, components, MDX bodies)
- Domain logic, data loading, content resolution
- Slice-specific hooks, helpers, types

The test: anything that would still make sense if you ported off
Next.js belongs in a slice. Anything that's about Next.js wiring
belongs in `app/`.

### Slice dependency direction (guideline, not hard rule)

The intended flow is `app/ → slice/ → shared/`, with slices not
importing from `app/`. This is a guideline for now, not enforced.
Tighten into a lint rule if cross-slice coupling becomes a concrete
problem in practice.

### `shared/` discipline

A file lives in `shared/` only if **both** are true:

1. Used by ≥2 slices
2. Has zero domain meaning (pure plumbing)

Anything domain-meaningful goes in the slice that owns the domain,
even if briefly duplicated. `shared/` starts with `cn.ts` and grows
only when a second consumer arrives for a genuinely cross-cutting
primitive.

## Consequences

**Positive:**

- A docs change touches `docs/` only. A layout change touches `app/`.
  Zero ambiguity.
- Agents working on a slice get a clear context boundary — "work in
  `docs/`" implies bounded scope.
- The Registry slice (per ADR-0001) is structurally signaled as the
  publishable surface, separate from the website that consumes it.
- App name now matches what the app does.
- Removing `src/` shortens every import path by one segment.

**Negative:**

- One-time migration cost: ~80 files move, all import paths update,
  configs (tsconfig, eslint, vitest, playwright) update.
- Issue #140 (registry generator) is blocked until the restructure
  merges to avoid double path rewrites.
- Loose layout component files at `app/` root mix with route folders.
  Mild visual inconsistency accepted in exchange for co-location with
  layout.tsx.

## Alternatives considered

**`/modules/` parent folder** — group all slices under
`apps/www/modules/`. Rejected because it reintroduces the `src/`
indirection under a new name, inflates import paths, and diverges
from reference codebases (shadcn v4, vercel examples).

**Nest slices inside `app/` via route groups + private folders** —
e.g. `app/(shell)/`, `app/docs/_components/`. Rejected because:

- Chrome isn't route-scoped; route groups exist to share layouts
  across a _subset_ of routes
- `_underscore` is a Next.js escape hatch sized for a few private
  files, not slice-sized chunks
- Mixing routes and slice content under `app/` muddies Next.js's
  mental model
- Reference codebases keep slices as siblings to `app/`

**Promote layout components to a `shell/` slice** — initially
proposed. Rejected because the layout components have exactly one
consumer (`app/layout.tsx`) and total ~5 files; they're layout
helpers, not a slice. They sit colocated next to `layout.tsx` inside
`app/` instead.

**Promote theme to a slice** — speculative future-proofing.
Rejected to avoid premature abstraction and to prevent name
collision with **theme** as defined in CONTEXT.md (component theming
via tokens, a Registry concern).

## References

- [The Vertical Codebase, Dominik Dorfmeister](https://tkdodo.eu/blog/the-vertical-codebase)
- ADR-0001 — Flat layout for the Registry slice
- CONTEXT.md — definitions of App, Slice, Registry, Landing, Component
