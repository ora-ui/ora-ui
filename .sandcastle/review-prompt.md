# Task

Review the implementer's PR. **Default to no-op.** Take no action unless
review work is clearly warranted.

## Context

### PR metadata

- **PR:** #{{PR_NUMBER}}
- **Branch:** `{{BRANCH}}`
- **Base:** `{{SOURCE_BRANCH}}`

### PR body

{{PR_BODY}}

### Branch diff

```
!`git fetch origin {{SOURCE_BRANCH}} && git diff origin/{{SOURCE_BRANCH}}...{{BRANCH}}`
```

### Existing review thread

{{REVIEW_THREAD}}

### Existing inline comments

{{REVIEW_COMMENTS}}

## Review decision

Evaluate the diff against the acceptance criteria in the issue. Output
your decision using **exactly one** of the three templates below.

---

### Option A — Approve

Use when the PR clearly satisfies all acceptance criteria with no
substantive gaps.

```
<promise>agent:review:approve</promise>

<review-summary>
2–5 sentences: why the PR is approved.
</review-summary>
```

Then post the review summary as a comment-state review (the bot cannot formally `--approve` its own PRs — that's blocked by GitHub. Final approval is human-only; the `agent-approved` label is the orchestrator's hand-off signal):

```bash
gh pr review {{PR_NUMBER}} --comment --body "<review-summary text>"
```

---

### Option B — Request changes

Use when substantive changes are needed: missing acceptance criteria,
incorrect behavior, incomplete scope.

```
<promise>agent:review:request-changes</promise>

<review-summary>
2–5 sentences: what changes are needed and why.
</review-summary>

<comments>
- **<FILE>:<LINE>** — comment text
- **<FILE>:<LINE>** — comment text
</comments>
```

Post the review summary as a comment-state review (same self-review constraint as Option A; the `agent-impl-todo` label drives the address-review loop, not GitHub's `reviewDecision`):

```bash
gh pr review {{PR_NUMBER}} --comment --body "<review-summary text>"
```

Then leave line-anchored comments via `gh api`:

```bash
gh api repos/ora-ui/ora-ui/pulls/{{PR_NUMBER}}/comments \
  --method POST \
  --field body="**<FILE>:<LINE>** — comment text" \
  --field commit_id="$(git rev-parse origin/{{BRANCH}})" \
  --field path="<FILE>" \
  --field line=<LINE>
```

---

### Option C — Escalate

Use when gates are broken, scope is ambiguous, or human judgment is required.

```
<promise>agent:review:escalate</promise>

<escalation-reason>
One paragraph: why escalation is needed.
</escalation-reason>
```

Stop here. Do not approve, do not request changes, do not push commits.

---

## No-op default

If the PR is clean by the bars above — criteria met, no substantive gaps,
gates passing — do nothing beyond Option A (approve). The reviewer never
pushes commits. The reviewer never merges.

---

{{SHARED}}
