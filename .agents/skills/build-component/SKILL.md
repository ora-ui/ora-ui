---
name: build-component
description: >-
  Guides building Ora UI components with enforced requirements gathering.
  Use when user asks to build or create a new component, or rework an
  existing shadcn import to follow Ora conventions — e.g. "build a select",
  "create a tooltip", "convert the dialog to Ora conventions". Not needed
  for small changes to components that already follow conventions.
---

# Build Component

The agent drafts the component's whole API from its archetype; the user
reviews and corrects it. The job of this skill is to get that draft
right and confirmed before any code is written.

The code is the source of truth. Read the reference files; don't copy
values from docs.

## When this skill applies

- **New components**: building a component that doesn't exist yet.
- **Convention rework**: reworking a shadcn import to follow Ora
  conventions. Treat the existing code as a starting point, not a spec.

Not for small changes to components that already follow conventions
(fixing a token, adjusting spacing, adding one prop).

## Phase 1: Research and classify

Do this before engaging the user.

1. **Read the primitive's docs.** If Base UI has the component, fetch
   `https://base-ui.com/llms.txt`, then the component's page. Note its
   anatomy (parts and nesting) and props.
2. **Classify the archetype.** Read `docs/patterns/archetypes.md` and
   pick the archetype from the anatomy signals there. If it fits two,
   use the outer one for the container and the inner one for the parts.
   If it fits none, say so.
3. **Read the reference implementation** named for that archetype in
   `apps/www/registry/ui/`. Also read
   `docs/adr/0011-component-styling-api.md` and
   `docs/adr/0010-radius-tiers-by-role.md` if you haven't this session.
4. **For a rework**, read the current component file, its playground
   entry (`apps/www/playground/entries/<name>.tsx`) and its docs page
   (`apps/www/docs/content/components/<name>.mdx`), if they exist.

## Phase 2: Draft and confirm requirements

**This is the gate. Don't write component code until the user confirms.**

Pre-fill every item from the archetype, Base UI and the reference file.
Mark each one **inferred** (you're confident) or **ask** (you're not).
Present it as a draft for the user to correct, not a questionnaire.

- [ ] **Archetype**, and the reference file you'll follow
- [ ] **Parts**: one Ora export per Base UI part, flat names
      (`SelectTrigger`); note any Ora-only parts
- [ ] **Theme**: none, `gray | accent` (default when unsure), plus
      `destructive` if it can be a destructive action, or the full
      status set if it conveys status. Default `gray`
- [ ] **Variants**: from `solid | soft | surface | outline | ghost`, and
      the default
- [ ] **Size / density**, if the archetype uses them
- [ ] **Radius per part**: dynamic, clamped (which step), concentric or
      full. Flag large surfaces in a "dynamic" archetype for an eye test
- [ ] **Context**: what the root propagates to parts (local props win)
- [ ] **Component-specific props**, grouped by ADR-0007
      (Appearance / Structure / Behavior)
- [ ] **CSS custom properties**: the few knobs users will reach for
- [ ] **Field / invalid state**, for text fields and selection controls
- [ ] **Playground**: which props become controls, and what content
      inputs the entry needs. Ask what the user wants to show

For a rework, also list **what to keep** and **what to change**.

Present it like this:

```
## Requirements draft — <Name>

**Type:** new | rework    **Primitive:** @base-ui/react/<x>
**Archetype:** <archetype> (reference: registry/ui/<file>.tsx)

| Concern | Draft | Source |
| --- | --- | --- |
| Theme | gray | accent, default gray | inferred (archetype) |
| Radius — Popup | rounded-md | inferred (archetype) |
| Radius — Item | --menu-item-radius | inferred (archetype) |
| Density | none | compact | comfortable | ask |
| ... | ... | ... |

Questions:
1. ...

Confirm or correct, and I'll build it.
```

Wait for a clear go-ahead. If the user changes something, update the
draft and confirm again.

## Phase 3: Scaffold, then implement

Start by scaffolding. Every argument is required; there is no prompt.

```bash
pnpm --filter www scaffold component <name> "<description>" "<variants|none>" <archetype>
```

`<name>` is kebab-case. `<variants>` is a comma-separated list of
variant values, or the literal `none` for archetypes without variants
(`plain-overlay`, `layout`). `<archetype>` is one of: `action`, `selection-control`,
`text-field`, `list-popup`, `plain-overlay`, `group`, `disclosure`,
`status-display`, `layout`. A missing argument prints usage; an unknown
archetype lists the valid ones. It aborts if `registry/ui/<name>.tsx`
already exists.

It writes:

- `apps/www/registry/ui/<name>.tsx` (the archetype's starting shape)
- `apps/www/playground/entries/<name>.tsx`
- `apps/www/docs/content/components/<name>.mdx`
- `apps/www/docs/previews/<name>/<name>-hero.tsx`
- `apps/www/docs/previews/<name>/<name>-<variant>.tsx`, one per variant

and then runs the generators, which update:

- `apps/www/registry.json` (`gen:manifest`)
- `apps/www/public/r/<name>.json` (the install file)
- `apps/www/docs/previews/registry.generated.ts` and
  `apps/www/registry/lib/sources.generated.ts` (`gen:registry`)
- `playground/entries/entries.generated.ts` and
  `docs/content/components/meta.json` (`gen:lists`)

No index needs a hand edit. Don't add the registry item to
`registry.json` yourself.

Then fill in `apps/www/registry/ui/<name>.tsx`, in this order. The
template imports the reference component's Base UI primitive; swap it
if yours differs.

1. **Types**: variant, theme and other unions. Theme follows whatever
   the reference file does for custom strings.
2. **cva definitions** using semantic tokens (`bg-ui`, `text-primary`,
   `border-border`). Reach into the colour scale only when no semantic
   token fits. The scaffold leaves variant classes empty.
3. **Context** (if any), with defaults matching the root's defaults.
4. **Parts**: wrap the Base UI part, set `data-slot="<name>-<part>"`,
   reflect appearance as `data-variant` / `data-size` / etc., set
   `data-theme={theme !== 'gray' ? theme : undefined}` where themed,
   and merge `className` with `cn()`.
5. **Exports**: one `export { ... }` at the bottom, including the
   `<name>Variants` function(s).

Don't add a header comment block listing CSS variables or slots.

## Phase 4: Playground, docs and checks

1. **Playground entry.** Edit the scaffolded
   `apps/www/playground/entries/<name>.tsx` (`<name>Entry:
EntrySchema`, types in `apps/www/playground/lib/types.ts`). Put
   Appearance/Structure props in `variants`, behaviour in `behavior`,
   and content inputs in `content`. Rerun `pnpm gen:lists` if you add
   a file (`pnpm dev` watches; `build`, `test:unit` and `typecheck`
   run it).
2. **Docs page.** Fill the scaffolded page and previews with the
   `document-component` skill (skip its scaffold step; `scaffold
component` already wrote them).
3. **Checks:**

   ```bash
   pnpm --filter www typecheck
   pnpm --filter www lint
   pnpm --filter www check:conventions
   ```

4. **Report** what you built, what you inferred versus what the user
   confirmed, and anything that needs an eye test in the playground
   (radius at high `--radius`, dark mode, each theme).

If you deviated from the archetype on purpose, add a line to the
exceptions in `docs/patterns/archetypes.md`, or suggest an ADR if it
changes the rule.
