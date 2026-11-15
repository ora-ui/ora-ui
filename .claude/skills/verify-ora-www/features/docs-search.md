# Docs search

Docs search lets a user find documentation pages and headings from a dialog opened in the header, move through results with the keyboard, and open one. It shows a distinct empty state when nothing matches.

## Sub-features

- `search-scope` the Search button and ⌘K exist only on `/docs` routes.
- `search-open-button` the header `Search` button opens the dialog.
- `search-open-kbd` ⌘K (Ctrl+K) opens the dialog with an empty query.
- `search-results` typing lists page and heading results.
- `search-open-result` Enter (or click) opens the active result and closes the dialog.
- `search-empty` a no-match query shows `No results for “<query>”`.
- `search-close` Escape closes.

## How to get to it (user POV)

- On any `/docs` page, click `Search` in the header (desktop) or the search icon button (mobile, same `Search` name).
- On any `/docs` page, press ⌘K / Ctrl+K.

## Driving it with drive.mjs

Preconditions:

- Baseline state; the docs content includes an `accordion` page (`apps/www/docs/content/components/accordion.mdx`).
- Journey: `scripts/drive.mjs docs-search`.

- **Scope.** Go to `/playground`. `banner.getByRole('button', { name: 'Search' })` has count 0.
- **Button entry.** Go to `/docs`, click `banner.getByRole('button', { name: 'Search' })`. A `dialog` with input `getByPlaceholder('Search docs...')` and text `Type to search documentation…` appears.
- **Results.** Fill `accordion`. First `dialog.getByRole('link')` has `href` starting `/docs/components/accordion`.
- **Open result.** Press Enter in the input. Dialog hides; URL is `/docs/components/accordion`; `h1` reads `Accordion`.
- **Keyboard entry.** Press `ControlOrMeta+k`. Dialog shows with an empty input.
- **Empty state.** Fill `zzqxv`. Text `No results for “zzqxv”` (curly quotes) appears. Escape hides the dialog.
- **API.** `GET /api/search?query=accordion` returns JSON whose entries include a `url` under `/docs/components/accordion`.
- **Proof.** ARIA snapshot and screenshot of the results list, screenshot of the empty state, final URL in `summary.json`.

## Gotchas

- The input has no label; locate it by placeholder.
- Results load asynchronously; wait on the result link or empty text, never a fixed sleep. A spinner shows while loading.
- Closing the dialog clears the query, so each reopen starts empty.
- Results render server-provided HTML with `<mark>` highlights; match on `href`, not on text, when asserting which page matched.
