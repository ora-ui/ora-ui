# ADR-0001: Flat layout for the Registry slice

## Status

Accepted — 2026-05-09

## Context

Ora UI ships as a shadcn-compatible **Registry** (see `CONTEXT.md`):
the components are intended to be installable via the shadcn CLI, not
just copy-pasted. This makes the on-disk layout of the Registry slice
load-bearing — the structure has to support an installable manifest
later, and it has to feel familiar to anyone arriving from shadcn/ui
or similar libraries.

Two layouts were considered:

1. **Per-component subfolder** — `registry/<component>/<component>.tsx`,
   each component owns a folder for future per-component metadata,
   helpers, and manifest fragments.
2. **Flat under `ui/`** — `registry/ui/<component>.tsx`, with
   registry-wide concerns (themes, manifest, configs) at the slice root.

## Decision

Adopt layout 2: flat under `ui/`. Per-component metadata and the
shadcn manifest live as sibling files at the slice root, keyed by
component name, not as per-component folders.

```
apps/www/src/registry/
├── ui/
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
├── themes/                ← if/when extracted
├── registry.json          ← shadcn manifest (future)
└── ...                    ← registry-wide config
```

Registry-build tooling (generators, manifest builders) stays in
`apps/www/scripts/`, not inside the slice.

## Consequences

**Positive:**

- Matches the dominant convention in the ecosystem (shadcn/ui v4,
  radix, react-aria-components). Contributors and consumers arriving
  from those projects find what they expect.
- Imports stay short: `@/registry/ui/button`.
- Registry-wide concerns (themes, manifest) have an obvious home at
  the slice root — they don't get scattered across per-component
  folders.

**Negative:**

- A component that grows multiple files (helper utilities, internal
  sub-components) must either inline them or break the flat rule with
  an opt-in subfolder. We accept this trade — when it happens, we will
  evaluate per-case rather than pre-emptively foldering everything.

## Alternatives considered

**Per-component subfolder** was rejected because:

- The motivating need (co-locating manifest fragments per component)
  is solvable with a single `registry.json` keyed by component name.
- It diverges from the convention contributors recognise.
- The migration cost (renaming 26 files into folders) is non-trivial
  for a benefit we can get without it.

## References

- shadcn/ui registry layout: `apps/v4/registry/new-york-v4/ui/`
- `CONTEXT.md` — definition of Registry vs Index
