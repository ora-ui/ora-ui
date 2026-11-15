# Docs component page

Each component has a docs page with a live preview, installation instructions per package manager, copyable code, usage sections, and a table of contents. Users reach it from the docs sidebar, search, or the mobile drawer.

## Sub-features

- `doc-nav` the docs sidebar lists Getting Started and component pages; clicking opens the page and highlights it.
- `doc-preview` `<ComponentPreview>` renders the live component (variant `<select>` when there are several) and its source.
- `doc-install-tabs` Installation tabs `CLI`/`Manual`; package manager tabs `pnpm`/`npm`/`bun`/`yarn` swap the command.
- `doc-copy` `Copy` / `Copy code` buttons put the shown code on the clipboard.
- `doc-toc` the right-hand table of contents (xl screens) jumps to sections.

## How to get to it (user POV)

- `/docs` → left sidebar link (e.g. `Button`), desktop only.
- Header `Search` / ⌘K → result (see docs-search.md).
- Mobile: header `Open navigation menu` → drawer link (see header-navigation.md).
- Direct URL `/docs/components/<name>` (names = files in `apps/www/docs/content/components`).

## Driving it with drive.mjs

Preconditions:

- Baseline state; viewport ≥1280px wide for the table of contents (default 1440x900).
- Journey: `scripts/drive.mjs docs-component-page`.

- **Navigate.** Go to `/docs`, click `main.getByRole('navigation').first().getByRole('link', { name: 'Button', exact: true })`. URL ends `/docs/components/button`; `h1` reads `Button`.
- **Preview.** Text matching `Preview not found` has count 0; `main` contains buttons.
- **Install tabs.** Text `pnpm dlx shadcn@latest add button` is visible; click `getByRole('tab', { name: 'npm', exact: true })`; text `npx shadcn@latest add button` is visible.
- **Copy.** In the command bar containing tab `npm`, click button `Copy`. `navigator.clipboard.readText()` returns `npx shadcn@latest add button`.
- **Table of contents.** Click link `Installation` (exact). URL ends `#installation`.
- **Proof.** Screenshots `button-page`, `install-npm`; ARIA snapshot of `main`; clipboard value recorded in the step's checks in `summary.json`.

## Gotchas

- The page has several `Copy` buttons (preview source first). Scope to the command bar that holds the tab you switched.
- `Preview not found: <name>` means `docs/previews/registry.generated.ts` is stale; `doctor.sh` warns about this. It is a real bug for the change under test, not a harness issue.
- Clipboard reads need the permission `drive.mjs` grants; a hand-rolled Playwright context without it reads an empty string.
- The sidebar and TOC are hidden below `lg` and `xl` respectively; at small viewports use the mobile drawer.
