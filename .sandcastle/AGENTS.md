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

# Autonomous (picks highest-priority agent-ready issue)
pnpm sandcastle

# Cleanup stale worktrees and branches after a session
pnpm sandcastle:clean
```

## Rules for agents

- Only work on issues labelled `agent-ready`
- One issue per run — do not pick up additional issues
- Branch naming: `agent/<short-description>` (provided via `--branch` arg in targeted mode)
- Commit prefix: `sandcastle-` e.g. `sandcastle-fix(badge): correct href`
- Package manager is **pnpm** — never use npm or yarn
- Gates must pass before committing: `pnpm typecheck` and `pnpm lint`
