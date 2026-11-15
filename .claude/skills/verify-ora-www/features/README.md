# Ora www verification map

This directory is the maintained source for verifying the user-facing behavior of the Ora UI website (`apps/www`). Read this index before driving the app, then use the matching feature file as the recipe and its journey in `../journeys/` as the executable version.

## Baseline preconditions

- A verify instance started by `scripts/launch.sh` (default `http://localhost:3117`, dist dir `apps/www/.next-verify`).
- `scripts/doctor.sh` exits 0: our process group owns the port, `/playground/button` serves Ora UI, search API answers.
- Fresh browser context per journey (`drive.mjs` makes one): dark theme, radius `Medium`, empty URL query, no `localStorage`.
- Never drive the user's `pnpm dev` on :3000 or any instance this run did not start.

## Driving conventions

- Start every recipe from the baseline state unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names (`getByRole`) over CSS selectors or DOM position. Use `exact: true` where one name is a prefix of another.
- Run browser actions through a journey: `scripts/drive.mjs <journey>`.
- Playground state lives in the URL; assert the query string after each control change.
- Theme and radius persist in `localStorage`; a fresh context resets them, a reload keeps them.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with the Ora header visible.
- Persisted state proof includes a reload and a second read of the stored value (URL, `localStorage`, `<html>` class, CSS variable).
- Copy proof reads the clipboard; search proof also checks `/api/search`.
- Record the journey name and evidence directory with every claim.
- Report an unreachable path with the attempted step, the URL, and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with drive.mjs` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact Playwright locator/action and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

## Features

- [Playground controls](./playground-controls.md) covers picking a component, changing variants/theme/content, and URL deep links. Journey `playground-controls`.
- [Playground theming](./playground-theming.md) covers radius and light/dark from the Theming tab, applied site-wide and persisted. Journey `playground-theming`.
- [Docs search](./docs-search.md) covers the header button, ⌘K, results, keyboard open, empty state. Journey `docs-search`.
- [Docs component page](./docs-component-page.md) covers sidebar navigation, live previews, install tabs, copy, and table of contents. Journey `docs-component-page`.
- [Header navigation](./header-navigation.md) covers primary nav, theme toggle, GitHub link, and the mobile drawer. Journey `header-navigation`.

## Not yet mapped

- Splash page `/` ("Launching soon", Space pauses the gradient, ←/→ cycle accent colour).
- Per-entry controls for the other playground components (Accordion list items, Select, Toggle Group, Alert Dialog, Input, Toggle). The `playground-controls` recipe applies; only Button is scripted.
