# ADR-0012: Documentation model — code is the source of truth

## Status

Accepted — 2026-11-14

## Context

Contributor docs (`COMPONENT-GUIDE.md`, `PLAYGROUND.md`,
`PRINCIPLES.md`, `docs/conventions/*`) described how the code should
look. They drifted quickly:

- Paths pointed at `apps/www/src/components/ui`, which no longer exists.
- The guide prescribed `getThemeStyles()`, which had been removed.
- `TOKEN-SYSTEM.md` was declared the token contract
  ([ADR-0009](0009-token-architecture.md)) but no longer matched
  `globals.css`.
- The playground doc described an entry shape replaced by
  `EntrySchema` ([ADR-0005](0005-schema-driven-playground-entries.md)).

Agents read these docs and followed them, so drift turned into wrong
code. Most agents work by reading the code anyway.

## Decision

Keep as little prose next to the code as possible.

| What                       | Where             | Holds                                                                                                          |
| -------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| How things are             | The code          | Tokens (`globals.css`), components (`registry/ui`), playground schema (`playground/lib/types.ts`)              |
| Why, when it isn't obvious | `docs/adr/`       | Intentional, non-obvious decisions. Point-in-time; amend with a dated note or supersede                        |
| What we usually do         | `docs/patterns/`  | Observed shapes (archetypes, Group, Item). Each rule names a reference file or an ADR. A guide, not a contract |
| How to do a task           | `.agents/skills/` | Step-by-step workflows (build, document, commit). The only place that lists file paths and commands            |
| Terms                      | `CONTEXT.md`      | Glossary                                                                                                       |

Rules:

- If a doc and the code disagree, the code wins and the doc is fixed or
  deleted.
- Don't restate code values in prose (token tables, prop lists). Point
  to the file.
- Paths and commands live only in skills, so a move means updating one
  place.
- `.agents/skills/` is canonical. `.claude/skills/*` are symlinks to it.

The removed docs' lasting decisions moved to
[ADR-0010](0010-radius-tiers-by-role.md) (radius),
[ADR-0011](0011-component-styling-api.md) (styling API and theming),
and the `build-component` and `document-component` skills (workflow and
docs-page conventions).

## Consequences

- Fewer docs to maintain; gaps are expected and filled as they come up.
- Patterns can go stale too. Keeping each rule tied to a reference file
  makes staleness easy to spot.
- New contributors start from `AGENTS.md`, which points here.
