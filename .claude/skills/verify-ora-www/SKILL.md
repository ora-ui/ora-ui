---
name: verify-ora-www
description: Launch and drive the Ora UI website (apps/www — Next.js docs site at /docs and component playground at /playground) in a real browser with Playwright, and capture screenshot/ARIA/clipboard evidence. Use to prove a UI, docs, playground, theming, or header change works in the running app, not just in unit tests. Runs an isolated instance beside any `pnpm dev` the user already has open.
---

# Verify Ora www

The only user-facing surface in this repo is `apps/www`, a Next.js 16 (Turbopack) app:

- `/` — splash page ("Launching soon"), not mapped.
- `/playground` and `/playground/<component>` — pick a component, tweak it via the Controls / Content / Theming sidebar. State lives in the URL query.
- `/docs` and `/docs/components/<name>` — MDX docs with live previews, install tabs, copy buttons, ⌘K search (`/api/search?query=`).

The component library itself (`apps/www/registry/ui`) has no separate surface; it is verified through these pages.

All helpers live in `.claude/skills/verify-ora-www/scripts/` and resolve the repo root via git, so run them from anywhere in the checkout. Below, `V=.claude/skills/verify-ora-www` (relative to the repo root).

## Isolation (read once)

The user usually has `pnpm dev` running on :3000. Never drive, restart, or kill it. Next 16 allows one `next dev` per dist dir, so the verify instance uses its own:

- `NEXT_DIST_DIR=.next-verify` (read by `apps/www/next.config.mjs`) on port **3117** by default.
- Run state lives in `apps/www/.verify/` (gitignored): `server.pid`, `port`, `server.log`, `next-env.d.ts.bak`, and `evidence/`.
- Starting `next dev` rewrites the gitignored `apps/www/next-env.d.ts` to point at `.next-verify`; `cleanup.sh` restores the original.
- Shared on purpose: `apps/www/.source/` (fumadocs-mdx output). Both servers regenerate it identically from `docs/content`.
- Two verify instances at once: pass a different port to `launch.sh`, but they share `.next-verify` and the state dir, so the second refuses to start. One verify instance per checkout.

## Launch

```bash
$V/scripts/launch.sh          # port 3117
$V/scripts/launch.sh 3200     # another port if 3117 is taken
```

It refuses if a verify server is already running or the port is held by anything else. It installs deps if `apps/www/node_modules/next` is missing, starts `pnpm exec next dev -p <port>` in its own process group, waits for `Ready in` in the log, then warms `/playground/button`, `/docs`, `/docs/components/button` and `/api/search?query=button` until each returns 200 (first compile takes ~5s per route). Ready = it prints `launch: ready at http://localhost:<port>`. No database, auth, env vars, or seed data exist; content is the MDX in `apps/www/docs/content` and the entries in `apps/www/playground/entries`.

Expected noise in `server.log` (not failures): `Unrecognized key(s) in object: 'turbopack' at "experimental"` and the "inferred your workspace root" lockfile warning.

## Doctor

```bash
$V/scripts/doctor.sh
```

Read-only; exit 0 means drive it. Checks: our pid alive; the port's listener is in our process group; `/playground/button` serves `<title>Ora UI</title>`; the search API returns results; prints the Next version, git commit/branch and uncommitted count (`next dev` serves the working tree live, so uncommitted edits are what you are testing); warns if the docs preview registry (`registry.generated.ts`) has drifted from `docs/previews` (fix: `pnpm -C apps/www gen:registry`, which edits tracked files, so tell the user); lists other node listeners that are **not ours**. Run it first whenever anything looks off.

## Drive

```bash
$V/scripts/drive.mjs <journey> [--out <dir>] [--headed] [--viewport 1440x900]
$V/scripts/drive.mjs playground-controls
$V/scripts/drive.mjs path/to/my-journey.mjs
```

`drive.mjs` uses the repo's own `@playwright/test` (Chromium from apps/www) against the port in `apps/www/.verify/port`, grants clipboard permissions, and runs one journey module. Shipped journeys (one per feature file) are in `$V/journeys/`:

| Journey               | Feature file                                                       |
| --------------------- | ------------------------------------------------------------------ |
| `playground-controls` | [features/playground-controls.md](features/playground-controls.md) |
| `playground-theming`  | [features/playground-theming.md](features/playground-theming.md)   |
| `docs-search`         | [features/docs-search.md](features/docs-search.md)                 |
| `docs-component-page` | [features/docs-component-page.md](features/docs-component-page.md) |
| `header-navigation`   | [features/header-navigation.md](features/header-navigation.md)     |

To prove something new, copy the closest journey to a scratch file and edit it. The module contract:

```js
export default async ({ page, context, base, step, shot, aria, check, expect }) => {
  await step('label', async () => {
    // pass/fail per step; a failure stops the journey
    await page.goto('/playground/toggle'); // baseURL is set
    await expect(page.getByRole('complementary')).toBeVisible();
    check(someBoolean, 'what it proves'); // recorded assertion
    await shot('name'); // NN-name.png
    await aria('name', locator); // NN-name.aria.yml (default: body)
  });
};
```

Stable handles in this app (prefer these over CSS/position):

- Header: `getByRole('banner')`; `navigation "Primary navigation"` → link `Documentation`; buttons `Search` (only on /docs), `Toggle theme`, link `GitHub`; mobile button `Open navigation menu` opens a `dialog` with title `Navigation`.
- Playground: left nav is the first `navigation` inside `main` (links named by entry, e.g. `Button`, `Toggle Group`); the preview renders inside `main`; controls sidebar is `getByRole('complementary')` with tabs `Controls`, `Content`, `Theming`.
  - Enum rows are labelled by visible text (`Variant`, `Theme`, `Size`, …). Select rows hold a `combobox` → `option` by value. Two-value rows are `ToggleGroup` buttons named by value (`leading`, `trailing`). Theme swatches are `radio` named `gray`/`accent`/`destructive`. Boolean rows are `switch`.
  - Content strings are `textbox` named by label (`Label`); groups are a `button` named by group label (`Icon`) that toggles the group's boolean.
  - Theming radios: `Accent color`/`Gray color` swatches, `Light`/`Dark`, radius `None`/`Small`/`Medium`/`Large`/`Extra Large`/`Full` (use `exact: true`: `Large` also matches `Extra Large`).
- Docs: sidebar is the first `navigation` inside `main` (also on /docs); `h1` = page title; install tabs `CLI`/`Manual`, package tabs `pnpm`/`npm`/`bun`/`yarn`; copy buttons are `Copy` (command bars) or `Copy code` (floating, MDX code blocks); search dialog input has placeholder `Search docs...`.
- Playground state is the URL query (`?variant=outline&theme=accent&label=Ship+it`), so a URL is a deep link you can assert on and reload.

## Evidence

Each run writes `apps/www/.verify/evidence/<UTC-timestamp>-<journey>/` (or `--out`):

- `NN-*.png` screenshots, `NN-*.aria.yml` ARIA snapshots, `NN-failure.png` on failure.
- `summary.json`: commit, base URL, viewport, each step with URL, duration, checks, error; plus `pageErrors`, `consoleErrors`, and same-origin `failedRequests` (status ≥ 400).
- The journey exits 1 on any failed step **or any uncaught page error**. Console errors are recorded but don't fail the run; read them and report them.

Proof standards:

- Drive the real user path: click the sidebar link, the tab, the swatch. Don't call React setters, don't `page.goto` a pre-built query string to skip the controls (except to prove deep-link reload, after the controls produced it).
- Capture the action and the resulting state: a screenshot before and after, plus the URL and a check on the rendered DOM (preview element, `<html>` class, computed `--radius`).
- Verify side effects alongside visuals: URL query for playground state, `localStorage` (`playground:radius`, next-themes `theme`), clipboard contents after `Copy`, `/api/search` response for search.
- Check both themes when a change touches colour tokens: the site defaults to dark, so flip with `Toggle theme` and shoot again.
- Mobile layout differs (sidebars hidden below `lg`, drawer nav): use `--viewport 390x844` or `page.setViewportSize` for responsive changes.
- No mocks are needed: the app has no backend beyond its own `/api/search`. `next/font/google` fetches Geist on first compile, so a cold launch needs network.

## Cleanup

```bash
$V/scripts/cleanup.sh
```

Kills only the process group `launch.sh` recorded (never by name, never :3000), restores `next-env.d.ts`, removes `apps/www/.next-verify` and the pid/port files, and moves `server.log` into `apps/www/.verify/evidence/server-<time>.log`. Evidence is kept. Run it after every session, including failed launches. Delete old evidence by hand (`rm -rf apps/www/.verify/evidence/<dir>`) only when the user is done with it.

## Feature map

[features/README.md](features/README.md) indexes the user-facing features, their entry points, and the observable end state that proves each one. When a change touches a mapped feature, cover every entry point the file lists, not just the convenient one. When you add a playground entry, docs page type, or header control, update the map and its journey.
