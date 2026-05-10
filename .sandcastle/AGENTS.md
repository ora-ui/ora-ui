# Sandcastle Agent Context

This repo uses [Sandcastle](https://github.com/mattpocock/sandcastle) to run autonomous coding agents in isolated Docker worktrees.

## How it works

- Agents run inside Docker containers with the project mounted at `/home/agent/workspace`
- Each run creates a dedicated `agent/*` branch forked from `develop`
- On completion, the branch is pushed and a draft PR is opened against `develop`

## Running sandcastle

```bash
# Targeted (preferred)
pnpm sandcastle --issue 124 --branch agent/fix-thing

# Skip the reviewer phase for straightforward tasks
pnpm sandcastle --issue 124 --branch agent/fix-thing --no-review

# Resume a failed run — run reviewer + PR on an existing branch
pnpm sandcastle --review-only --branch agent/fix-thing

# Autonomous (picks highest-priority agent-ready issue)
pnpm sandcastle

# Cleanup stale worktrees and branches after a session
pnpm sandcastle:clean

# Test whether the configured provider captures early vs final agent output tags
pnpm sandcastle --test-propagation
```

## PR title and description

Every draft PR opened by Sandcastle follows the title format:

```
sandcastle: agent/<short-description>
```

The PR body is taken from the `<pr-summary>` block emitted by the implementer at the end of its run. If no such block is present, a generic fallback message is used instead.

## Rules for agents

- Only work on issues labelled `agent-ready`
- One issue per run — do not pick up additional issues
- Branch naming: `agent/<short-description>` (provided via `--branch` arg in targeted mode)
- Commit prefix: `sandcastle-` e.g. `sandcastle-fix(badge): correct href`
- Package manager is **pnpm** — never use npm or yarn
- Gates must pass before committing: `pnpm typecheck` and `pnpm lint`
