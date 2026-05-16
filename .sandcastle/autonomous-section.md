## Context (autonomous mode)

### Open issues

!`gh issue list --state open --label agent-ready --json number,title,body,labels,comments --jq '[.[] | select(.labels | map(.name) | contains(["awaiting-review"]) | not) | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'`

### Recent agent commits

!`git log --oneline --grep="^sandcastle-" -10`

## Issue selection

Pre-flight: verify the issue you intend to pick is still OPEN.

```
gh issue view N --json state --jq .state
```

If `CLOSED`, do not work on it — emit BLOCKED.

Priority order — pick the highest-priority issue from the **Open issues**
list above that is not blocked:

1. **Bug fixes** — broken behaviour
2. **Small enhancements** — additive, scoped to a single component or doc
3. **Polish** — error messages, copy, doc fixes
4. **Refactors** — internal cleanups, no user-visible change

You MUST pick an issue from the **Open issues** list. Every issue in that
list carries the `agent-ready` label. Do not work on any other issue.

## Dependency check

If the chosen issue's body or comments contain "Depends on", "Blocked by",
or "Blocked on" followed by issue references (`#N`, `#141, #142`, or range
`#141-#147`), check the state of every referenced issue:

```
gh issue view N --json state --jq .state
```

If any referenced issue is `OPEN`, skip and emit BLOCKED naming the
unresolved deps. Only proceed when every referenced issue is `CLOSED`.

## Scope ceiling

Before committing, check the projected diff size:

```
git diff --stat
```

If your changes exceed **500 lines** or touch **>8 files**, stop and emit
BLOCKED with the scope as the reason — unless the issue body explicitly
demands a large change (e.g. cross-cutting refactor). The reviewer cannot
safely vet runs larger than this.

If the highest-priority issue looks too ambitious for an autonomous run
(multi-component, ambiguous requirements, needs design input), skip it and
emit BLOCKED **for the iteration** (do not blame the issue).
