# Changelog Plan

## Intent

When the project reaches a good state for an **alpha release**, set up [git-cliff](https://git-cliff.org/) to auto-generate a `CHANGELOG.md` from the existing conventional commit history.

## Why git-cliff

- All commits already follow conventional commit format (`feat:`, `fix:`, `refactor:`, etc.)
- git-cliff can backfill the entire migration history in one command
- No publishable packages exist yet, so Changesets (already installed) is premature — revisit Changesets when component packages are extracted

## When to do this

At alpha release time. Steps will be:

1. Install git-cliff
2. Add a `cliff.toml` config — filter out `docs:`, `chore:`, `notes:` commits; group by `feat`, `fix`, `refactor`
3. Run `git-cliff` to generate `CHANGELOG.md`
4. Optionally expose as a `/changelog` page in the Fumadocs docs site
5. Tag the alpha release (`v0.1.0-alpha.0`)
