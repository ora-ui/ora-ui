# Context

## Open issues

!`gh issue list --state open --label Sandcastle --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`

## Recent agent commits (last 10)

!`git log --oneline --grep="^sandcastle:" -10`

# Task

You are an autonomous coding agent working through GitHub issues for **Ora UI**, a TypeScript monorepo of accessible, composable UI primitives. The project uses **pnpm**.

## Priority order

Work on the highest-priority open issue that is not blocked:

1. **Bug fixes** — broken behaviour
2. **Small enhancements** — additive changes scoped to a single component or doc
3. **Polish** — error messages, copy, doc fixes
4. **Refactors** — internal cleanups with no user-visible change

If the highest-priority issue looks too ambitious for an autonomous run (multi-component, ambiguous requirements, or needs design input), skip it and explain why in the BLOCKED reason for the _iteration_, not the issue.

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
   - Start with `sandcastle:` prefix (lowercase) followed by a conventional type, e.g. `sandcastle: fix(button): correct focus ring color`
   - Reference the issue number in the body (`Closes #N`)
7. **Close** — close the issue with `gh issue close <ID> --comment "Completed by Sandcastle"`.

## Rules

- **One issue per iteration.** Do not bundle.
- Do not close an issue until the commit is made and gates are green.
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

When the issue is complete (committed, closed, gates green), output:

`<promise>COMPLETE</promise>`
