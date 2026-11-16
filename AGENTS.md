Styled primitives and composable patterns for building beautiful, accessible interfaces.

This is a typescript monorepo that uses pnpm as package manager.

## Secrets

- Never commit a real API key, access token, password, or private key
  to this repository. Real secrets live in `.env` (gitignored)
  or in the deployment environment's secret manager.
- Sample configuration files (`sample-config.json`, `.env.example`)
  may contain placeholder values that look like credentials. Use
  obviously-fake values like `your_api_key_here`, not values that could
  be mistaken for real keys.
- Gitleaks runs in the pre-commit hook. If it flags your commit, do
  not bypass it. Remove the secret and replace it with a placeholder.
- If you believe a gitleaks finding is a false positive, add an
  allowlist entry in `.gitleaks.toml` with a comment explaining why.
  Do not add to `.gitleaksignore` without a comment.

## Where things live

- **Code is the source of truth.** Tokens: `apps/www/registry/theme/globals.css`.
  Components: `apps/www/registry/ui/`. If a doc disagrees with the code, the code wins.
- **Workflows** (build, document, commit, file an issue): `.agents/skills/`.
  `.claude/skills/*` are symlinks to it — edit the `.agents` copy.
- **Building a new component**, from a request or a new-component issue:
  the build-component skill. An `agent-ready` issue from the
  new-component template is its approved requirements.
- **Why** something non-obvious is the way it is: `docs/adr/`.
- **What we usually do** (archetypes, Group, Item): `docs/patterns/`. A guide, not a contract.
- **Terms**: `CONTEXT.md`.
