# ADR-0003: Sandcastle orchestration — separate implementer and reviewer

## Status

Proposed — 2026-05-16

## Context

The current Sandcastle setup (`.sandcastle/main.mts`) runs one agent that
both implements an issue and then reviews its own work in a second pass,
inside a single iteration. The reviewer can edit the branch directly,
push, and open a draft PR.

This collapses two distinct concerns into one process and has several
costs:

- **Token waste.** Implementation is mechanical (read issue, edit files,
  run gates); review benefits from a more capable model. Sharing one
  model spends review-grade tokens on impl-grade work.
- **No mid-loop human intervention.** A human can't read the reviewer's
  feedback before it lands as committed edits — the loop is opaque
  until the draft PR appears at the end.
- **Prompts grew to handle both modes.** `implement-prompt.md` and
  `review-prompt.md` mix autonomous-vs-targeted and with-vs-without-review
  paths inside the prompt, gated by the agent self-detecting which mode
  it's in. Already filed as a separate refactor
  ([#184](https://github.com/ora-ui/ora-ui/issues/184)).
- **No structural loop bound.** If the impl→review pass produces a poor
  result, today the run ends with a sub-par PR. There's no mechanism
  to retry, escalate, or cap rounds.
- **Operational friction.** Every run is invoked manually. There's no
  background mode that picks up `agent-ready` issues on a schedule.

We want to:

1. Reduce token spend by routing impl and review to different models.
2. Add a structural loop bound that prevents impl↔review ping-pong.
3. Run autonomously on a schedule with deterministic failure modes.
4. Keep the system bit-for-bit reversible during rollout (pre-alpha
   constraint — token budget is tight, blast radius must be small).

## Decision

Split the implementer and reviewer into independent, separately-spawned
runs coordinated by an orchestrator that gates on GitHub state. The
orchestrator owns all transitions; agents stay stateless and unaware of
the broader workflow.

### 1. Topology

```
[issue: agent-ready, no PR]
  → implementer (fresh mode) runs
  → commits + pushes + opens draft PR with `agent-review-pending`

[PR: draft, agent-review-pending]
  → reviewer runs, leaves PR review comments
  → either: swaps label to `agent-impl-todo` (changes requested)
  → or:    adds `agent-approved`, marks PR ready-for-review

[PR: draft, agent-impl-todo]
  → implementer (address-review mode) runs
  → commits + pushes, swaps label back to `agent-review-pending`

[PR: ready-for-review, agent-approved]
  → human merges (or closes)

[issue: needs-human OR PR: needs-human]
  → bots ignore, human owns
```

Reviewer never edits the branch and never merges. It only comments and
flips labels. Final merge is a human action.

### 2. Two implementer prompts

- `implement-fresh.md` — picks up an `agent-ready` issue with no PR.
  Reads issue body, explores codebase, plans, commits, opens draft PR.
- `implement-address-review.md` — picks up a PR with `agent-impl-todo`.
  Reads PR review comments, makes surgical edits to address them,
  commits, pushes.

Reviewer stays one prompt (`review-prompt.md`). Shared content
(gates, commit format, BLOCKED protocol, PR/branch naming) lives in
`shared.md` and is injected into all three.

### 3. Label taxonomy

| Label                  | Lives on | Set by                                        | Cleared by                      | Meaning                               |
| ---------------------- | -------- | --------------------------------------------- | ------------------------------- | ------------------------------------- |
| `agent-ready`          | issue    | human (triage)                                | label-cleanup workflow on close | Fair game for autonomous impl         |
| `needs-human`          | issue/PR | reviewer (rounds cap) or orchestrator (crash) | human                           | Stop bot work                         |
| `agent-review-pending` | PR       | implementer push                              | reviewer run                    | New commits, awaiting review          |
| `agent-impl-todo`      | PR       | reviewer (changes requested)                  | implementer push                | Comments left, awaiting impl response |
| `agent-approved`       | PR       | reviewer (sign-off)                           | n/a                             | Reviewer satisfied, PR ready          |

`awaiting-review` is retired — its role splits into `agent-review-pending`
(on PR) and the implicit "open PR exists" check on the issue.

### 4. Loop prevention (two layers)

**Layer 1 — Orchestrator timestamp gate.** Before spawning either agent,
the orchestrator queries:

```bash
gh pr view N --json commits,reviews \
  --jq '{last_commit: (.commits | last | .committedDate),
         last_review: (.reviews | last | .submittedAt)}'
```

- Spawn **reviewer** only if `last_commit > last_review`.
- Spawn **implementer (address-review)** only if `last_review > last_commit`
  AND review has unresolved comments.
- Neither newer → skip. Nothing to do.

Oscillation is structurally impossible — there is no state in which
both agents have something to do.

**Layer 2 — Rounds cap.** Count reviewer-authored reviews on the PR:

```bash
gh pr view N --json reviews \
  --jq '[.reviews[] | select(.user.login == "ora-ui-sandcastle-bot")] | length'
```

At cap (default: 2 reviews), reviewer stops commenting and adds
`needs-human` to the issue + PR. Orchestrator excludes anything carrying
`needs-human`.

### 5. Scheduling — GitHub Actions, no VPS

Two workflows:

- `sandcastle-v2-impl.yml` — fires on `on: schedule:` (twice daily sweep)
  only. Scans for issues needing fresh impl and PRs with `agent-impl-todo`.
- `sandcastle-v2-review.yml` — fires on `on: schedule:` (twice daily,
  offset) + `on: pull_request.synchronize` for draft PRs with
  `agent-review-pending`.

`on: issues.labeled` was considered for `sandcastle-v2-impl.yml` but rejected.
Issues are frequently created in batches (e.g. from a `to-issues` run against
a PRD), which would fire N simultaneous orchestrator invocations — one per
label event. Even with a concurrency group, the queued runs would re-process
an already-handled backlog. The orchestrator's full work-list scan on every
invocation makes scheduled sweeps the natural trigger; event firing only adds
value when sub-minute latency matters, which pre-alpha does not require.
`on: pull_request.synchronize` is kept on the review workflow because PR
pushes are 1:1 events, not batch.

Each workflow runs the orchestrator script (`main.v2.mts`), which:

1. Determines the work list via `gh` queries.
2. Applies the timestamp gate.
3. Spawns the appropriate sandcastle run.

Concurrency: GH Actions allows 20 parallel jobs (free/pro tier); not a
constraint at this scale.

### 6. CI cascade mitigation

PR pushes trigger `main.yml` (CI) and `playwright.yml` (60min). Agent
loops would multiply this cost. Two changes:

- **Draft-gate `main.yml`.** Add `if: github.event.pull_request.draft == false`.
  CI only runs once the reviewer marks the PR ready-for-review.
- **Move `playwright.yml` to `on: push: branches: [main]`** plus manual
  `workflow_dispatch` and release branches. Trade: bugs may land on main
  before Playwright catches them, mitigated by occasional revert. Agent
  runs `pnpm typecheck && pnpm lint` locally, covering ~90% of regressions.

### 7. Bot identity

A dedicated GitHub user (`ora-ui-sandcastle-bot`) authors all agent
commits, PR comments, and reviews. Required for layer-2 rounds counting
(`filter reviews by user.login`). PAT scoped to `repo` + `workflow`,
stored as `SANDCASTLE_BOT_TOKEN` repo secret.

GitHub App identity is the right long-term destination (scoped perms,
JWT auth, marketplace-ready). Parked — setup cost is 2–4hrs and not
load-bearing for the initial rollout. Migration is clean: the bot
user's historical reviews stay attributed; the App takes over going
forward.

## Alternatives considered

### Reviewer feedback channel

- **Issue comments.** Reviewer posts on the GitHub issue, implementer
  re-reads next run. Rejected — pollutes the issue thread and loses
  line-level anchoring.
- **Structured artifact in branch.** Reviewer writes
  `.sandcastle/review-{branch}.md`, commits it, implementer reads and
  deletes. Rejected — noisy commits, no GitHub-native UI surface.
- **PR review comments (chosen).** Line-anchored, native GitHub review
  UX, humans can intervene in the same surface. Cost: must open draft PR
  earlier than today.

### Scheduling host

- **VPS + cron.** Cheap ($5/mo) but adds provisioning, secret
  management, Docker setup, and monitoring burden. Rejected for
  pre-alpha — too much overhead vs benefit.
- **Local cron / launchd.** Free but requires laptop awake. Rejected as
  primary; viable as testing aid.
- **Implementer self-chains reviewer in-process.** Rejected — re-couples
  the agents, defeats the split, crash-fragile.
- **GitHub Actions (chosen).** Free for public repos (unlimited
  minutes), 20 concurrent jobs, secrets management built-in, no infra
  to maintain. Combines scheduled sweep + event triggers.

### Loop prevention mechanism

- **Token budget per issue.** Reject for control; keep for monitoring
  only. Cross-run token accounting across providers is messy.
- **Identical-diff heuristic.** Detect stuck implementer by diff hash.
  Rejected — false-positive prone.
- **Comment count cap.** Caps surface area but not rounds. Rejected as
  primary mechanism.
- **Rounds cap + timestamp gate (chosen).** Two cheap, deterministic
  checks. Structural elimination of oscillation.

### Bot identity

- **Personal PAT (status quo).** Breaks rounds counting (your manual
  reviews and the bot's are indistinguishable). Rejected.
- **GitHub App.** Right destination but 2–4hr setup cost; parked.
- **Dedicated bot user (chosen).** ~30min setup, unblocks rounds
  counting, clean UI separation.

### Implementer prompt structure

- **Single prompt, conditional sections via `{{MODE}}`.** Rejected —
  reproduces the bloat #184 is trying to fix.
- **Same prompt, different context injected.** Rejected — fresh vs
  address-review need different steering (explore vs surgical).
- **Two prompt files (chosen).** Each short and focused. Dedup via
  `shared.md`.

### ADR location

Considered placing this under `.sandcastle/docs/adr/`. Rejected — the
decision touches `.github/workflows/`, repo-wide labels, and an
org-level bot user. Not contained to the tooling directory. Co-locating
ADRs is the right move when sandcastle accumulates its own bounded
context (3+ local ADRs + a glossary); not yet.

## Rollout

Run-based, not time-based — pre-alpha activity is sporadic.

| Phase                          | Mechanic                                                                                                                                                                          | Exit criteria                                                                                                                                                                           | Est. work |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| **0 — Dry-run**                | `pnpm sandcastle:v2 --dry-run` computes intended actions, logs them, exits without side effects                                                                                   | 5 dry runs covering ≥4 distinct state transitions (fresh-spawn / skip-already-reviewed / skip-already-addressed / rounds-cap escalation / idle-no-work), zero unexpected actions logged | half day  |
| **1 — Single synthetic issue** | File a trivial `agent-ready` test issue tagged `agent-v2`. Run full new orchestrator end-to-end                                                                                   | One full impl→review→approve loop completes without intervention. Rounds cap verified by manual forced retry.                                                                           | few hours |
| **2 — Opt-in coexistence**     | Both old and new orchestrators run; v2 only acts on issues with `agent-v2` label                                                                                                  | 2 real issues shipped via v2 lane, no orchestrator bugs                                                                                                                                 | 1 day     |
| **3 — Cutover**                | Drop `agent-v2` gate. Rename `main.mts` → `main.legacy.mts` (kept ~10 commits for fast rollback, then deleted). Migrate `main.yml` draft-gating and `playwright.yml` push-to-main | All future runs go through v2. Legacy retired.                                                                                                                                          | minutes   |

Total: ~2–3 days hands-on.

### Coexistence mechanics during rollout

1. **Separate entry point.** `pnpm sandcastle` (old) unchanged.
   `pnpm sandcastle:v2` runs `main.v2.mts`. Zero shared code.
2. **Opt-in label.** v2 only processes items with `agent-v2`. v2 also
   excludes `awaiting-review` (old's marker) belt-and-braces.
3. **Disjoint label namespace.** New labels don't collide with old.
   Shared label `agent-ready` is read-only for v2 in Phases 0–2;
   writes begin at Phase 3.
4. **`--dry-run` flag.** Phase 0's entire mechanic. No `gh` writes, no
   Docker spawns, no spend.
5. **Bot token is opt-in.** v2 reads `SANDCASTLE_BOT_TOKEN`; falls back
   to `GH_TOKEN` if unset. Bot user only required from Phase 1.
6. **Workflows are additive.** New `sandcastle-v2-*.yml` workflows are
   `workflow_dispatch`-only in Phases 0–1, scheduled in Phase 2.
   Existing `main.yml` and `playwright.yml` are untouched until
   Phase 3.

### Rollback per phase

- **Phase 0:** do nothing. No state changed.
- **Phase 1:** close test PR, delete branch, close test issue.
- **Phase 2:** remove `agent-v2` from open issues; disable v2 workflow
  schedules.
- **Phase 3:** revert cutover commit. `main.legacy.mts` restored as
  `main.mts`.

Until Phase 3, the old system is bit-for-bit identical to today.

## Consequences

**Positive:**

- Cheaper-model implementer + smarter-model reviewer reduces per-issue
  spend without lowering quality.
- Structural loop bound (timestamp gate + rounds cap) eliminates the
  primary failure mode (impl↔review ping-pong).
- PR-comments-as-feedback gives humans a native intervention surface
  mid-loop, not just at end.
- Autonomous scheduling without VPS — GH Actions handles cadence and
  events.
- Draft-gating CI + push-to-main Playwright slashes CI cost on agent
  iterations.
- Each phase rollback is one command or one PR revert.

**Negative:**

- More moving parts: orchestrator script, two prompts, three workflows,
  five labels, bot user.
- Playwright moving off PRs means bugs may land on main before
  Playwright catches them. Mitigated by local gates + occasional
  revert; acceptable for pre-alpha.
- Bot user PAT in repo secrets is a credential to rotate. Scope is
  contained (`repo` + `workflow`).
- Cross-run state lives in GitHub labels + PR metadata. Manual label
  edits can confuse the orchestrator (mitigated by idempotent
  re-evaluation each sweep).

## Followups

- Fix `label-cleanup.yml` — missing `permissions: issues: write`,
  hidden by `continue-on-error: true`. Also needs to handle PR-close
  cleanup of new labels.
- Issue #184 — prompt refactor (mode-specific sections, scope ceilings,
  no-op-default reviewer). Lands inside this rework.
- GitHub App migration — parked. Revisit when there's a forcing
  function (org scaling, fine-grained perms, marketplace).
