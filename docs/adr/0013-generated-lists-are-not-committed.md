# ADR-0013: Generated lists are not committed

## Status

Accepted — 2026-11-15

## Context

The playground entry index (`apps/www/playground/entries/`) and the docs
sidebar `meta.json` were hand-maintained sorted lists. They went stale
(`meta.json` listed toast, toolbar, tooltip and visually-hidden, none of
which has a page) and every new component edited both.

Both lists are derivable from the files on disk, so a generator
(`apps/www/scripts/gen-lists.ts`) builds them. The open question was
whether to commit the output, as gen-registry does.

Two branches that each insert into a committed sorted list at the same
spot conflict in git. Measured: toolbar and tooltip added after
toggle-group on separate branches produce a merge conflict. The ticket's
goal that two branches adding a component don't conflict is impossible
for a committed generated file.

## Decision

`entries.generated.ts` and `meta.json` are gitignored and never
committed. Every command that needs them generates them first:
`pnpm dev` (watch mode), `build`, `test:unit`, `typecheck`, and
`postinstall` for fresh clones and editors. `postinstall` only warns
when generation fails, so a bad entry file blocks commits and builds
but never `pnpm install`.

Rejected:

- **fumadocs' `"..."` rest operator in `meta.json`.** It sorts by file
  path, which puts `button-group` before `button`. It also covers only
  the docs list, not the playground index.
- **Commit the output and fail CI when stale** (the gen-registry
  model). It still conflicts on merge, and a pre-commit restage step does
  not help once two branches have diverged.

## Consequences

- No merge conflict on either list. Adding a component touches only its
  own files.
- A checkout without `pnpm install` or `pnpm gen:lists` has no
  `entries.generated.ts`, and imports of `@/playground/entries` fail
  until it is generated. `launch.sh` and the post-checkout hook run
  `pnpm gen:lists`, so bare `next dev` and branch switches that delete
  `meta.json` regenerate it.
- `meta.json` is invisible in git. Sidebar order is always alphabetical
  by slug. Custom ordering would need a different mechanism.
- A playground entry file must export a const named `<camelSlug>Entry`
  or generation throws.
