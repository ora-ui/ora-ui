# Header navigation

The sticky site header gives every page a logo link home, a Documentation link, a GitHub link, and a light/dark toggle. On small screens the docs navigation moves into a bottom drawer.

## Sub-features

- `hdr-docs-link` `Primary navigation` → `Documentation` goes to `/docs`.
- `hdr-logo` the logo links to `/`.
- `hdr-github` `GitHub` opens `https://github.com/ora-ui/ora-ui` in a new tab.
- `hdr-theme` `Toggle theme` flips dark/light and persists across reload.
- `hdr-mobile-drawer` below `lg`, `Open navigation menu` opens a `Navigation` drawer with all docs pages.

## How to get to it (user POV)

- Visible at the top of every page except the full-screen splash `/`.
- Desktop (≥1024px): Documentation link, GitHub, separator, theme toggle (plus Search on /docs).
- Mobile (<1024px): Search icon (on /docs), menu button, theme toggle.

## Driving it with drive.mjs

Preconditions:

- Baseline state (dark theme).
- Journey: `scripts/drive.mjs header-navigation`.

- **Docs link.** Go to `/playground`, click `banner.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Documentation' })`. URL ends `/docs`.
- **Logo.** First `banner` link has `href="/"`.
- **GitHub.** `banner.getByRole('link', { name: 'GitHub' })` has the repo `href` and `target="_blank"`.
- **Theme toggle.** `<html>` has class `dark`; click `banner.getByRole('button', { name: 'Toggle theme' })`; class `dark` is gone. Reload: still light.
- **Mobile drawer.** Set viewport 390x844, go to `/docs`, click `Open navigation menu`. A `dialog` with text `Navigation` lists docs links; click `Input` (exact). URL ends `/docs/components/input`; `h1` reads `Input`.
- **Proof.** Screenshots `docs-light`, `mobile-drawer`; ARIA snapshot of the drawer.

## Gotchas

- The header on `/` is covered by the full-screen splash; start from `/playground` or `/docs`.
- There is no header link to `/playground` today (a commented-out `Components` link would point at `/docs/components`).
- The drawer is swipe-to-dismiss; `Close navigation menu` closes it explicitly.
- Theme state is shared with the Theming tab and stored in `localStorage` under `theme`; a fresh browser context resets to dark.
