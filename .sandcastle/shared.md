# Shared protocol

## Gates

Before any commit, both must pass:

- `pnpm typecheck`
- `pnpm lint`

Never use `--no-verify` or any flag that skips hooks. Fix root causes.

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
