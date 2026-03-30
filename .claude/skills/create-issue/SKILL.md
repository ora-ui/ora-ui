---
name: create-issue
description: Creates a GitHub issue with structured context. Use when the user asks to file a bug, log an issue, or create an enhancement request.
---

# Create Issue

## Workflow

1. **Gather context** — ask the user if any of the following are unclear:
   - What was found (the problem or enhancement)
   - Where it was found (component, file, or area)
   - Suggested action or expected behavior

2. **Determine labels** — apply the appropriate labels:
   - **Type label** — `bug` or `enhancement`
   - **Component label** — if the issue relates to a specific component,
     use the label `component: {name}` (e.g., `component: dropdown-menu`).
     If the label doesn't exist yet, create it first using
     `gh label create "component: {name}" --color "8B5CF6"`.

3. **Create the issue** — use `gh issue create` with the structure below.

## Issue structure

**Title** — concise, imperative. Describe the problem or request, not
the solution.

```
Good: "dropdown-menu label must be nested inside a group"
Bad:  "fix dropdown menu"
```

**Body** — three sections:

```markdown
## What

[One or two sentences describing the problem or enhancement.]

## Where

[Component, file, or area where this was observed.]

## Suggested action

[What should be done to resolve this, if known.]
```

## Example

```bash
gh issue create \
  --title "badge: solid variant foreground token incorrect in dark mode" \
  --label "bug" \
  --label "component: badge" \
  --body "$(cat <<'EOF'
## What

The solid variant uses `--foreground` instead of `--foreground-solid`
for text color, causing low contrast on filled backgrounds in dark mode.

## Where

Badge component, solid variant styles.

## Suggested action

Replace `--foreground` with `--foreground-solid` in the solid variant's
text color definition.
EOF
)"
```
