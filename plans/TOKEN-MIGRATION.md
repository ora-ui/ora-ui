# Token Migration Plan

Migration from the previous Ora token names to the new system defined in `docs/THEME-TOKENS.md`.

---

## Token Rename Reference

| Old token          | New token              | Tailwind (old)        | Tailwind (new)                      |
| ------------------ | ---------------------- | --------------------- | ----------------------------------- |
| `--app`            | `--background`         | `bg-app`              | `bg-background`                     |
| `--subtle`         | `--background-subtle`  | `bg-subtle`           | `bg-background-subtle`              |
| `--ui`             | `--background-ui`      | `bg-ui`               | `bg-background-ui`                  |
| `--ui-hover`       | `--hover`              | `bg-ui-hover`         | `bg-hover`                          |
| `--ui-active`      | `--active`             | `bg-ui-active`        | `bg-active`                         |
| `--solid`          | `--background-solid`   | `bg-solid`            | `bg-background-solid`               |
| `--overlay`        | `--background-overlay` | `bg-overlay`          | `bg-background-overlay`             |
| _(new)_            | `--line-subtle`        | —                     | `border-line-subtle`                |
| `--text-primary`   | `--foreground`         | `text-text-primary`   | `text-foreground`                   |
| `--text-secondary` | `--foreground-subtle`  | `text-text-secondary` | `text-foreground-subtle`            |
| `--text-solid`     | `--foreground-solid`   | `text-text-solid`     | `text-foreground-solid`             |
| `--line-ui`        | `--line-ui`            | `border-line-ui`      | `border-line-ui` _(unchanged)_      |
| `--line`           | `--line`               | `border-line`         | `border-line` _(unchanged)_         |
| `--focus`          | `--focus`              | `outline-focus`       | `outline-focus` _(unchanged)_       |
| `--focus-solid`    | `--focus-solid`        | `outline-focus-solid` | `outline-focus-solid` _(unchanged)_ |

> **Note on opacity modifiers** — when a token is used with an opacity modifier (e.g. `bg-background-ui/50`), the rename carries over directly. No special handling needed.

---

## Components

### `button.tsx`

Two areas to update: `getThemeStyles` (inline CSS variable overrides) and `buttonVariants`.

**`getThemeStyles` — rename the CSS variable keys:**

```
'--ui'            → '--background-ui'
'--ui-hover'      → '--hover'
'--ui-active'     → '--active'
'--solid'         → '--background-solid'
'--text-secondary'→ '--foreground-subtle'
'--text-primary'  → '--foreground'
'--text-solid'    → '--foreground-solid'
```

`--line-ui`, `--focus`, `--focus-solid` are unchanged.

**`buttonVariants` — rename Tailwind classes:**

```
bg-solid          → bg-background-solid
bg-solid/90       → bg-background-solid/90
bg-solid/80       → bg-background-solid/80
text-text-solid   → text-foreground-solid
bg-ui             → bg-background-ui
bg-ui-hover       → bg-hover
bg-ui-active      → bg-active
text-text-secondary → text-foreground-subtle
text-text-primary → text-foreground
```

The `text-gray-50` compound variant (solid + gray) can be replaced with `text-foreground-solid` once the migration is complete.

---

### `button-group.tsx`

```
bg-ui-active  → bg-active
```

`border-line-ui` is unchanged.

---

### `input.tsx`

```
bg-ui/50  → bg-background-ui/50
bg-ui/75  → bg-background-ui/75
```

---

### `textarea.tsx`

Same as `input.tsx`:

```
bg-ui/50  → bg-background-ui/50
bg-ui/75  → bg-background-ui/75
```

---

### `toggle.tsx` / `toggle-group.tsx`

Not yet fully on Ora tokens. Audit during migration — apply new token names from the start rather than migrating old ones.

Key classes to check for: any `bg-ui*`, `border-line*`, `text-text-*` usage. The toggle-group border edge case (currently using `color-mix` as a workaround) should be re-evaluated against `border-line-subtle` as part of this migration.

---

### `badge.tsx`, `kbd.tsx`, `separator.tsx`

Partially migrated on the current branch. Audit for any remaining old token names before closing out those components.

---

### Remaining components

The following components are still on shadcn tokens and have not been migrated to Ora tokens yet. Skip for now — migrate to new Ora tokens directly when each component is picked up.

- `accordion.tsx`
- `alert-dialog.tsx`
- `avatar.tsx`
- `checkbox.tsx`
- `dialog.tsx`
- `dropdown-menu.tsx`
- `label.tsx`
- `radio-group.tsx`
- `sonner.tsx`
- `switch.tsx`
- `toolbar.tsx`
- `tooltip.tsx`
- `visually-hidden.tsx`

---

## Migration Order

1. `button.tsx` — highest token surface area, most variants; sets the pattern for everything else
2. `button-group.tsx` — simple, one change
3. `input.tsx` + `textarea.tsx` — paired, straightforward
4. `toggle.tsx` + `toggle-group.tsx` — re-evaluate `line-subtle` usage here
5. `badge.tsx`, `kbd.tsx`, `separator.tsx` — finish what's in progress
6. Remaining components — as they're picked up for feature work
