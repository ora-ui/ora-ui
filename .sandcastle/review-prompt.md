# TASK

Review the code changes on branch `{{BRANCH}}` and improve code clarity, consistency, and maintainability while preserving exact functionality.

# CONTEXT

## Branch diff

!`git diff {{SOURCE_BRANCH}}...{{BRANCH}}`

## Commits on this branch

!`git log {{SOURCE_BRANCH}}..{{BRANCH}} --oneline`

# REVIEW PROCESS

1. **Understand the change**: Read the diff and commits above to understand the intent.

2. **Analyze for improvements**: Look for opportunities to:
   - Reduce unnecessary complexity and nesting
   - Eliminate redundant code and abstractions
   - Improve readability through clear variable and function names
   - Consolidate related logic
   - Remove unnecessary comments that describe obvious code
   - Avoid nested ternary operators - prefer switch statements or if/else chains
   - Choose clarity over brevity - explicit code is often better than overly compact code

3. **Check correctness**:
   - Does the implementation match the intent? Are edge cases handled?
   - Are new/changed behaviours covered by tests?
   - Are there unsafe casts, `any` types, or unchecked assumptions?
   - Does the change introduce injection vulnerabilities, credential leaks, or other security issues?

4. **Maintain balance**: Avoid over-simplification that could:
   - Reduce code clarity or maintainability
   - Create overly clever solutions that are hard to understand
   - Combine too many concerns into single functions or components
   - Remove helpful abstractions that improve code organization
   - Make the code harder to debug or extend

5. **Apply project standards**: Follow the coding standards defined in @.sandcastle/CODING_STANDARDS.md

6. **Preserve functionality**: Never change what the code does - only how it does it. All original features, outputs, and behaviors must remain intact.

# EXECUTION

If you find improvements to make:

1. Make the changes directly on this branch
2. Run `pnpm typecheck && pnpm lint` to ensure nothing is broken
3. Commit describing the refinements (prefix the message with `sandcastle:`)

If the code is already clean and well-structured, do nothing.

Once complete, output a title and the completion signal:

```
<pr-title>agent:type(scope): short description</pr-title>

<promise>COMPLETE</promise>
```

`<pr-title>` must follow the format `agent:type(scope): description`. Use the type that best describes the overall change: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, or `perf`. Scope should be the component or area changed (e.g. `button`, `badge`, `docs`). Base it on the diff and commit messages above. Keep the description under 60 characters.

If you cannot review safely (broken gates you can't fix, change scope unclear), output a `<blocked-reason>...</blocked-reason>` block followed by `<promise>BLOCKED</promise>`.
