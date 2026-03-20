# Component Strategy — Ora UI v0.1.0

A working guide for building out components from zero to one. Favours speed and delivery while avoiding gaps that create problems later.

---

## Context

All 20 shadcn components are installed as a base layer. The work ahead is:

1. **Customisation** — making these components ours (design tokens, variants, style)
2. **Documentation** — MDX docs pages per component
3. **Registry validation** — confirming each JSON installs correctly via the shadcn CLI

---

## Branch Strategy

### Theme first, but timebox it

Custom tokens (`--primary`, `--accent`, grays, semantic colors, border radii, spacing) are the foundation everything builds on. Customising a component before the color system is stable means revisiting it.

Do a `chore/theme-tokens` branch first. Lock in the core color scales, radii, and typography conventions. Timebox it — a day or two at most. Don't chase perfection; stable enough to build against is the goal.

### One component (or tight group) per branch

After theme is stable, branch per component or per semantically coupled group off `develop`:

```
develop
  └── feat/button
  └── feat/badge-kbd-separator
  └── feat/form-inputs          (input, label, textarea)
  └── feat/form-controls        (checkbox, radio-group, switch)
  └── feat/toggle               (toggle + toggle-group)
  └── feat/overlay              (tooltip, dialog, alert-dialog, dropdown-menu)
  └── feat/accordion
  └── feat/avatar
  └── feat/toast
  └── feat/toolbar
```

**Avoid:** a single `feat/components` catch-all branch — it becomes long-running, hard to review, and accumulates debt.

**Avoid:** `feat/form` as a scope — that's a feature, not a component; too big, will stall.

---

## Component Grouping Rationale

### Standalone — one per branch

Button, badge, separator, avatar. Atomic, no coupling.

### Semantically coupled — group together

| Branch                     | Components                    | Why                                                             |
| -------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `feat/form-inputs`         | input, label, textarea        | Almost always used together; label styling affects input layout |
| `feat/form-controls`       | checkbox, radio-group, switch | All form controls, share similar anatomy and token usage        |
| `feat/toggle`              | toggle, toggle-group          | toggle-group wraps toggle — must be visually consistent         |
| `feat/badge-kbd-separator` | badge, kbd, separator         | All trivial atoms; fast wins, batch them                        |

### Respect dependency order

- Do `tooltip` before `dropdown-menu` if dropdown uses tooltip internally
- Do `dialog` before `alert-dialog` (alert-dialog typically extends dialog)

---

## Definition of Done (Per Branch)

A component branch is ready to merge when:

1. **Styled** — component uses our design tokens, not default shadcn styles
2. **Documented** — MDX doc page complete: props table, usage examples, variants shown
3. **Registry tested** — actually run `npx shadcn@latest add "https://ora-ui.com/r/[component].json"` and confirm clean install
4. **PR merged** into develop

The registry testing step is the one most likely to be skipped and regretted. Test early.

---

## Recommended Starting Order

| Priority | Branch                     | Notes                                                                    |
| -------- | -------------------------- | ------------------------------------------------------------------------ |
| 1        | `chore/theme-tokens`       | Lock in color system, radii, type scale                                  |
| 2        | `feat/button`              | Canary. Validates registry, establishes doc template, tests CVA variants |
| 3        | `feat/badge-kbd-separator` | Quick wins, build momentum                                               |
| 4        | `feat/form-inputs`         | input, label, textarea                                                   |
| 5        | `feat/form-controls`       | checkbox, radio-group, switch                                            |
| 6+       | Continue per table above   |                                                                          |

Button is the right first component because it has multiple variants (CVA states to validate), it appears everywhere in the docs, and it already has staged changes. Get button right and you have a repeatable process for everything else.

---

## Gaps to Watch

### Will bite you later

- **Undocumented variants** — if a `ghost` or `outline` variant isn't documented, it effectively doesn't exist for users
- **Untested registry JSONs** — files that look correct but fail on install
- **Inconsistent token usage** — mixing `var(--primary)` with hardcoded hex breaks theming

### Fine to leave for now

- Exhaustive, perfect docs on day one — a basic usage example is enough to ship
- Separator, AspectRatio, VisuallyHidden are trivial — document them in 20 minutes and move on
- Edge case variants and composition patterns — v0.1.0 is about coverage, not completeness
