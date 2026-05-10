# Context

## Open issues

!`gh issue list --state open --label agent-ready --json number,title,body,labels,comments --jq '[.[] | select(.labels | map(.name) | contains(["awaiting-review"]) | not) | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`

## Recent agent commits (last 10)

!`git log --oneline --grep="^sandcastle-" -10`

# Task

You are an autonomous coding agent working through GitHub issues for **Ora UI**, a TypeScript monorepo of accessible, composable UI primitives. The project uses **pnpm**.

## Your task

{{ISSUE_DIRECTIVE}}

## Priority order (autonomous mode)

Work on the highest-priority open issue that is not blocked:

1. **Bug fixes** — broken behaviour
2. **Small enhancements** — additive changes scoped to a single component or doc
3. **Polish** — error messages, copy, doc fixes
4. **Refactors** — internal cleanups with no user-visible change

If the highest-priority issue looks too ambitious for an autonomous run (multi-component, ambiguous requirements, or needs design input), skip it and explain why in the BLOCKED reason for the _iteration_, not the issue.

If an issue's **body or comments** contain "Depends on", "Blocked by", or "Blocked on" followed by one or more issue references (single `#N`, comma list `#141, #142`, or range `#141-#147`), check the state of **every** referenced issue: `gh issue view N --json state --jq .state`. If any referenced issue is `OPEN`, skip and output a BLOCKED reason naming the unresolved deps. Only proceed when every referenced issue is `CLOSED`.

## Workflow

1. **Announce the issue** — output `<working-on-issue>NUMBER</working-on-issue>` on its own line so the orchestrator can track which issue this run is for. Do this **before** writing any code.
2. **Explore** — read the issue body and comments fully. Read the source files involved before changing them. Skim relevant docs in `docs/conventions/` if the change touches a component.
3. **Plan** — decide the smallest change that satisfies the issue.
4. **Execute** — make the change. Keep edits tightly scoped — do not refactor surrounding code unless the issue asks for it.
5. **Verify** — these gates **must pass** before you commit:
   - `pnpm typecheck`
   - `pnpm lint`

   Fix failures before proceeding. Do not commit a red build.

6. **Commit** — single git commit. The message MUST:
   - Start with `sandcastle-` prefix (lowercase) followed by a conventional type, e.g. `sandcastle-fix(button): correct focus ring color`
   - Reference the issue number in the body (`Closes #N`)
7. **Summarise** — see the **Done** section below. Output `<pr-summary>` and `<promise>COMPLETE</promise>` together in one final message. Replace `#N` with the actual issue number — the `Closes #N` line auto-closes the issue on merge.

## Rules

- **One issue per iteration.** Do not bundle.
- Do not close issues directly — the `Closes #N` line in the PR summary handles that on merge.
- No commented-out code, no `TODO` comments, no `any` casts added.
- Do not edit files outside the scope of the issue.
- Do not modify the lockfile (`pnpm-lock.yaml`) unless the issue is specifically about dependencies.

## When you're stuck

If you cannot complete the task — failing gate you don't understand, missing context, ambiguous spec, or the change is bigger than expected — **do not commit a partial fix**. Instead:

1. Output a reason block on its own:

   ```
   <blocked-reason>
   One paragraph: what you tried, what failed, what you'd need to proceed.
   </blocked-reason>
   ```

2. Then output the BLOCKED signal:

   `<promise>BLOCKED</promise>`

The orchestrator will post the reason as a comment on the issue and move on.

# Done

When the issue is complete (committed, gates green), output the title, summary, and completion signal together in the same final message — do not split them across separate messages:

```
<pr-title>agent:type(scope): short description</pr-title>

<branch-name>agent-type/scope-short-description</branch-name>

<pr-summary>
Short description of what was changed and why (2–5 sentences).

Closes #N
</pr-summary>

<promise>COMPLETE</promise>
```

`<pr-title>` must follow the format `agent:type(scope): description`. Use the type that best describes the change: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, or `perf`. Scope should be the component or area changed (e.g. `button`, `badge`, `docs`). Keep the description under 60 characters.

`<branch-name>` must follow the format `agent-type/scope-short-description` — e.g. `agent-fix/button-focus-ring`, `agent-feat/badge-href`. Use the same type and scope as `<pr-title>`. Hyphens only within each segment, no special characters. Only output `<branch-name>` if you are in autonomous mode (i.e. you chose the issue yourself — not given a specific issue to work on).
