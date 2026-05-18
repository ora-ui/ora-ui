# Shared protocol

## Branch discipline

The branch you start on is the only branch you may touch. Forbidden commands:

- `git checkout -b ...`
- `git switch -c ...`
- `git branch <new>`
- `git branch -m ...`
- `git worktree add ...`

If you believe a different branch is needed, emit BLOCKED with the reason —
do not act on it. Violation here strands work on a branch the orchestrator
cannot find and produces silent zero-commit runs.

## Gates

Before any commit, both must pass:

- `pnpm typecheck`
- `pnpm lint`

Never use `--no-verify` or any flag that skips hooks. Fix root causes.

A gate failure you cannot resolve → emit BLOCKED. Never rationalize a
failing gate as "environment-related" or "unrelated to my changes" and
proceed to COMPLETE. If gates are red, the only valid outcomes are: fix
them, or BLOCKED.

## Commit format

Single commit per run. Message MUST:

- Start with `sandcastle-` followed by a conventional type and optional scope,
  e.g. `sandcastle-fix(button): correct focus ring color`
- Reference the issue in the body: `Closes #N` (do not close manually — the
  `Closes #N` line auto-closes on merge)

## BLOCKED protocol

Use BLOCKED when you cannot finish safely: failing gate you can't fix,
missing context, ambiguous spec, change exceeds scope ceiling, or no clean
revert path. Do not commit a partial fix.

Output:

```
<blocked-reason>
One paragraph: what you tried, what failed, what you'd need to proceed.
</blocked-reason>

<promise>BLOCKED</promise>
```

The orchestrator posts the reason as a comment on the issue and moves on.

## PR title / branch name

- `<pr-title>` format: `agent:type(scope): description` (≤60 chars).
  Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`.
- `<branch-name>` format: `agent-type/scope-short-description`
  (e.g. `agent-fix/button-focus-ring`). Hyphens only within segments.
