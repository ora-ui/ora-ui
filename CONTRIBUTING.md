# Contributing to Ora

Thank you for your interest in contributing to Ora.

## Project Status

Ora is in early development. We are building the foundation — the core
components, patterns, and conventions that will define the project.

## Get Vouched Before Opening a Pull Request

Pull requests from people who are not vouched for are closed automatically.
This keeps the review queue manageable while the project stabilizes.

To get vouched, open a
[vouch request](https://github.com/ora-ui/ora-ui/issues/new?template=vouch_request.yml):
say who you are and what you want to work on, in your own words. A maintainer
will reply `vouch`, which adds you to [`.github/VOUCHED.td`](.github/VOUCHED.td).
After that, your pull requests stay open. If one was closed before you were
vouched, open a new one or ask in your vouch request for it to be reopened.

Collaborators don't need to be vouched. The system is
[Vouch](https://github.com/mitchellh/vouch).

## How to Contribute

### Bug Fixes and Improvements

Bug fixes, performance improvements, and documentation fixes are welcome.
Once you're vouched, open a pull request with a clear description of the
problem and solution.

### New Features, Components, or Patterns

For anything beyond bug fixes, **please open an issue or start a discussion
first**. This ensures alignment with the project's vision before you invest
time in implementation.

We want contributions to succeed, not be rejected after significant effort.
A quick conversation upfront helps us understand your idea and guide you
toward an approach that fits the project.

### What to Include in a Proposal

When proposing a new component or pattern, include:

- **What it is** — describe the component or pattern
- **Why it's needed** — the problem it solves, the use cases it serves
- **Accessibility considerations** — how it handles focus, keyboard
  navigation, screen readers
- **Prior art** — any research, articles, or examples that inform the design

### Building Components

If your contribution is approved, read the following before starting:

1. [Archetypes](docs/patterns/archetypes.md) — the kinds of component and what each needs
2. [Architecture decisions](docs/adr/) — why things are the way they are, notably
   [styling API](docs/adr/0011-component-styling-api.md) and
   [radius tiers](docs/adr/0010-radius-tiers-by-role.md)
3. The `build-component` skill in [.agents/skills](.agents/skills/build-component/SKILL.md) — the step-by-step build process

The code is the source of truth; see [ADR-0012](docs/adr/0012-documentation-model.md).

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Questions?

Open a discussion or issue on GitHub.
