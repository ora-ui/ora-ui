---
name: git-commits
description: Stages and commits changes following conventional commits. Use when the user asks to commit, stage files, or write a commit message.
---

# Git Commits

## Conventional commit types

| Type | When to use |
| --- | --- |
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `chore` | Build, tooling, deps, config — no production code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, whitespace — no logic change |
| `test` | Adding or updating tests |
| `docs` | Documentation only |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |

## Rules

**Scope** — only add `(scope)` when the change is directly tied to a

specific, named context (e.g. a module, package, or subsystem). Omit it

otherwise.

**Atomic commits** — each commit should represent one logical unit of work. A unit of work is a cohesive change that accomplishes a single purpose — adding a feature layer, setting up a subsystem, fixing one bug. Multiple files often belong together; unrelated changes in the same file should be split. Ask: *"Does this commit do one thing well?"*

**Grouping** — group related files into one commit when they serve the

same purpose. Prefer fewer, well-named commits over many granular ones.

Examples:

- All files for a new database layer → one commit
- Port interfaces + their adapters → one commit
- Unrelated config change + feature code → separate commits

**Body / description** — only add a body when:

- The subject line can't fully capture the change, or
- There is important additional context (e.g. WIP, a known blocker, an
edge case)

Keep the body short and factual. No Co-authorship lines unless the user

explicitly asks.

## Format

[optional scope]:

[optional body]

- Subject: imperative mood, lowercase, no trailing period, ≤72 chars
- Body: plain prose, wrap at 72 chars, separated from subject by a blank
line

## Workflow

1. Run `git status` and `git diff --stat` to understand what changed.
2. Identify logical units of work — group by purpose, not by file.
3. If unrelated changes exist, split into separate commits.
4. Stage files belonging to the first unit and commit.
5. Repeat for remaining units.

