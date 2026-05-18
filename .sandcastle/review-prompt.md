# Task

Review the implementer's work on branch `{{BRANCH}}`. **Default to no-op.**
Commits during review are the exception, not the norm.

## Context

### Branch diff

!`git diff {{SOURCE_BRANCH}}...{{BRANCH}}`

### Commits on this branch

!`git log {{SOURCE_BRANCH}}..{{BRANCH}} --oneline`

## When to commit a refinement

Commit **only** when the change clearly meets one of these:

- **Correctness fix** — bug, edge case, unsafe cast, missing handling
- **Security fix** — injection, leak, unchecked input from a boundary
- **Substantial clarity gain** — ≥10 net lines removed AND readability
  improves (consolidating duplication, flattening nesting, deleting dead
  code)

**Forbidden:** aesthetic-only edits, renames for taste, comment churn,
re-ordering imports, formatting changes, splitting/joining lines, adding
abstractions "for future use".

If the diff is already clean by this bar — do nothing and emit COMPLETE.
The implementer's commit stands as-is.

## Error cases

- **Empty diff** (`git diff {{SOURCE_BRANCH}}...{{BRANCH}}` is empty) →
  emit COMPLETE with `<pr-title>` based on the latest commit message.
- **Gates fail on entry** (typecheck/lint already red before your edits) →
  do not edit. Emit BLOCKED with the failing output.
- **Gates fail after your edits** → revert your changes (`git reset --hard`
  to the implementer's commit), then emit COMPLETE on the original. Do not
  ship a red build.

## Workflow

1. Read the diff and commits above.
2. Check correctness, edge cases, security.
3. Apply the **When to commit** bar. If nothing qualifies, skip to step 6.
4. Make the change. Single commit per shared protocol.
5. Run gates (`pnpm typecheck && pnpm lint`). Revert if red.
6. Output:

   ```
   <pr-title>agent:type(scope): short description</pr-title>

   <pr-summary>
   2–5 sentences: what changed and why, based on the branch diff and commits.

   Closes #N
   </pr-summary>

   <promise>COMPLETE</promise>
   ```

   Base `<pr-title>` and `<pr-summary>` on the combined intent of the branch.
   Derive `Closes #N` from the issue number referenced in the branch's commit
   messages; omit the line if none is referenced. Do not add the
   `awaiting-review` label — the orchestrator handles it.

---

{{SHARED}}
