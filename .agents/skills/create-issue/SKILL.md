---
name: create-issue
description: Creates a GitHub issue with structured context. Use when the user asks to file a bug, log an issue, or create an enhancement request.
---

# Create Issue

## Workflow

1. **Infer first** — read the conversation context and any relevant source
   files to fill in as much of the issue as possible before asking anything.
   Only ask the user about gaps you genuinely cannot fill from context.

2. **Explore and verify** — investigate the relevant code to confirm the
   issue and enrich the body with specifics:
   - Read relevant files, components, or token definitions.
   - Confirm the issue exists as described.
   - Note additional context (affected areas, root cause, related patterns).
   - If investigation shows the issue is already resolved or the premise is
     wrong, challenge the assumption and ask whether to proceed.

3. **Determine labels** — always apply:
   - **Type label** — `bug` or `enhancement`
   - **Component label** (if applicable) — `component: {name}`. Create it
     first if it doesn't exist:
     `gh label create "component: {name}" --color "8B5CF6"`
   - **Readiness label** — one of:
     - `agent-ready` — well-scoped, self-contained, clear acceptance criteria,
       safe for an autonomous agent to pick up without human input
     - `needs-triage` — requirements are unclear, cross-cutting, or need
       design input before work can start

4. **Draft the issue** — write the full issue title and body using the
   structure below and show it to the user for review. Do not create the
   issue yet.

5. **Confirm and create** — wait for the user to approve or request changes.
   Once approved, run `gh issue create` with the final content.

## Issue structure

**Title** — concise, imperative. Describe the problem or request, not
the solution.

```
Good: "dropdown-menu label must be nested inside a group"
Bad:  "fix dropdown menu"
```

**Body:**

```markdown
## Problem

[One or two sentences describing what is broken or missing and why it matters.]

## Desired behaviour

[What it should do instead, or what the enhancement should add.]

## Acceptance criteria

- Specific, testable conditions an agent or reviewer can verify
- Written so that "done" is unambiguous

## Implementation notes

[Optional. Relevant files, suggested approach, or non-obvious constraints.]

## Out of scope

[Explicit boundary — what this issue deliberately does not cover.]
```

Omit **Implementation notes** and **Out of scope** sections only if they add
no value (e.g. trivially obvious issues). Always include **Acceptance criteria**
for `agent-ready` issues.

## Example

```bash
gh issue create \
  --title "badge: solid variant foreground token incorrect in dark mode" \
  --label "bug" \
  --label "component: badge" \
  --label "agent-ready" \
  --body "$(cat <<'EOF'
## Problem

The solid variant uses `--foreground` instead of `--foreground-solid` for text
color, causing low contrast on filled backgrounds in dark mode.

## Desired behaviour

Text on the solid badge variant should use `--foreground-solid` so it remains
legible in both light and dark modes.

## Acceptance criteria

- Solid variant text uses `--foreground-solid` token in all themes
- No visible regression on other badge variants
- `pnpm typecheck` and `pnpm lint` pass

## Out of scope

Other variants and their foreground tokens.
EOF
)"
```
