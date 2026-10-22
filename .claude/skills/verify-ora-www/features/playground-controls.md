# Playground controls

The playground lets a user pick a component from the left sidebar, change its properties (variant, theme, behavior) and content (label, icon, list items) from the right-hand controls sidebar, see the live preview update, and share or reload the exact configuration through the URL.

## Sub-features

- `pg-pick` opens a component from the Components sidebar; the active link is highlighted.
- `pg-variant` changes an enum property through a select (`Variant`) and the preview restyles.
- `pg-theme-swatch` changes the `Theme` property through gray/accent/destructive swatches.
- `pg-content-string` edits text content (`Label`) and the preview text follows.
- `pg-content-group` enables a grouped option (`Icon`) and its children (`Position`).
- `pg-deeplink` every change is written to the URL query; reloading restores it.

## How to get to it (user POV)

- Go to `/playground` (the header has no playground link yet), then choose a component in the left `Components` list.
- Open `/playground/<component>` directly (accordion, alert-dialog, button, input, select, toggle, toggle-group).
- Open a shared deep link such as `/playground/button?variant=outline&theme=accent`.
- The left list and controls sidebar are desktop-only (hidden below the `lg` breakpoint).

## Driving it with drive.mjs

Preconditions:

- Baseline state from the README; viewport at least 1024px wide (default 1440x900).
- Journey: `scripts/drive.mjs playground-controls`.

- **Pick component.** Go to `/playground`, heading `Introduction` is visible. Click `getByRole('link', { name: 'Button', exact: true })`. URL ends `/playground/button`; `main` contains button `Button`.
- **Variant.** In `getByRole('complementary')`, find the row with text `Variant`, click its `combobox`, choose `getByRole('option', { name: 'outline' })`. URL gains `variant=outline`; combobox text reads `outline`.
- **Theme swatch.** Click `complementary.getByRole('radio', { name: 'accent' }).first()` (the Theming tab also has an `accent` radio). URL gains `theme=accent`; preview turns accent-coloured.
- **Label.** Click tab `Content`, fill `getByRole('textbox', { name: 'Label' })` with `Ship it`. Preview button is named `Ship it`; URL has `label=Ship+it`.
- **Icon group.** Click `getByRole('button', { name: 'Icon', exact: true })`. URL gains `icon=true`; click `getByRole('button', { name: 'trailing' })`. URL gains `iconPosition=trailing`; the preview button's last child is an `svg`.
- **Deep link.** Reload the current URL. Preview still `Ship it` with trailing icon, Variant combobox still `outline`.
- **Proof.** ARIA snapshot of the page after reload plus screenshots `button-default`, `outline-accent`, `label-icon-trailing`, `reloaded`, and the final URL in `summary.json`.

## Gotchas

- The Theming tab panel is kept mounted, so radios named `accent`/`gray` exist twice; scope to the first or to the Controls tab panel.
- `Position` is disabled unless `Icon` is on and `Label` is non-empty (`visibleWhen`). Clearing the label disables it.
- Two-value enums render as a ToggleGroup of buttons, not a select; `Variant` is always a select; `true`/`false` pairs render as a `switch`.
- URL updates use `history: replace`; the back button does not step through control changes.
- Defaults are omitted from the URL. `?variant=solid` disappears when you select solid again.
