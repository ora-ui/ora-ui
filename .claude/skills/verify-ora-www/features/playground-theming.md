# Playground theming

The Theming tab of the playground controls sidebar lets a user change the global corner radius and switch between light and dark appearance. Both apply to the whole site immediately and survive a reload.

## Sub-features

- `theme-radius` choosing a radius step sets `--radius` on `<html>` and stores it as `playground:radius`.
- `theme-appearance` Light/Dark switches the `dark` class on `<html>` (next-themes, stored as `theme`).
- `theme-persist` both survive reload.
- `theme-swatches` Accent/Gray colour swatches render (single option each today; no effect yet).

## How to get to it (user POV)

- Any `/playground/<component>` page → controls sidebar → `Theming` tab.
- Appearance can also be flipped with the header `Toggle theme` button (see header-navigation.md); both write the same next-themes value.

## Driving it with drive.mjs

Preconditions:

- Baseline state: dark theme, radius `Medium`, empty `localStorage`.
- Journey: `scripts/drive.mjs playground-theming`.

- **Open tab.** Go to `/playground/button`, click `complementary.getByRole('tab', { name: 'Theming' })`. Radio `Medium` is checked; `<html>` has class `dark`.
- **Radius.** Click `getByRole('radio', { name: 'Large', exact: true })`. It becomes checked; computed `--radius` on `<html>` is `0.75rem`; `localStorage['playground:radius'] === 'lg'`.
- **Appearance.** Click `getByRole('radio', { name: 'Light', exact: true })`. `<html>` loses class `dark`; page renders light.
- **Persist.** Reload. Re-open `Theming`: `Large` and `Light` checked, `--radius` still `0.75rem`, no `dark` class.
- **Proof.** Screenshots `theming-default`, `light-large-radius`, `reloaded`; ARIA snapshot of the controls sidebar.

## Gotchas

- Use `exact: true` on radius names: `Large` also matches `Extra Large`.
- The radius is applied after mount from `localStorage`; read `--radius` with `expect.poll`, not once immediately after reload.
- Radius only applies on pages that mount the Theming panel (playground). Visiting `/docs` in the same tab keeps the inline style until a full navigation; a fresh load of `/docs` uses the CSS default.
- The tab selection itself is not persisted; after reload you must click `Theming` again.
