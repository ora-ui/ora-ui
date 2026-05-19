# Sandcastle Agent Context

This repo uses [Sandcastle](https://github.com/mattpocock/sandcastle) to run autonomous coding agents in isolated Docker worktrees.

## How it works

- Agents run inside Docker containers with the project mounted at `/home/agent/workspace`
- Each run creates a dedicated `agent-type/scope-description` branch forked from `develop`
- On completion, the branch is pushed and a draft PR is opened against `develop`

## Running sandcastle

```bash
# Orchestrator (runs automatically on schedule; also supports manual invoke)
# --dry-run (default): computes actions without side effects
# --execute: acts on the decision table
pnpm sandcastle
pnpm sandcastle --dry-run  # same as default (env var SANDCASTLE_DRY_RUN=1)
pnpm sandcastle --execute  # dispatch agents

# Targeted (preferred via skill)
pnpm sandcastle --issue 124 --branch agent-fix/button-focus-ring

# Emergency rollback to the pre-cutover implementation
pnpm sandcastle:legacy
```

## Branch naming

Branches follow the pattern `agent-type/scope-description` — e.g. `agent-fix/button-focus-ring`, `agent-feat/badge-href`. This mirrors conventional commits and lets you bulk-delete agent branches:

```bash
git branch | grep 'agent-' | xargs git branch -D
# or use the script:
pnpm sandcastle:clean
```

## PR title and description

PR titles follow conventional commit format: `agent:type(scope): short description`.

The PR body is taken from the `<pr-summary>` block emitted by the implementer at the end of its run. If no such block is present, a generic fallback message is used instead.

## Bot identity

All sandcastle commits, PR comments, and reviews are authored by the dedicated bot user **`ora-gh-bot`**. Downstream code (e.g. the orchestrator's rounds-counting layer) filters reviews by `user.login == "ora-gh-bot"` to distinguish agent reviews from human ones.

The bot's PAT is provided to sandcastle via the `GH_TOKEN` env var (local: `.sandcastle/.env`; CI: repo secret `SANDCASTLE_BOT_TOKEN` mapped to `GH_TOKEN`).

## Rules for agents

- Only work on issues labelled `agent-ready` (no opt-in label required)
- One issue per run — do not pick up additional issues
- Branch naming: `agent-type/scope-description` (provided via `--branch` arg in targeted mode)
- Commit prefix: `sandcastle-` e.g. `sandcastle-fix(badge): correct href`