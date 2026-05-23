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
