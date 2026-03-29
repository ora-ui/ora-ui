# Playground Restructure: Component Explorer with Controls

## Context

The playground is a single 1056-line file rendering 21 component sections. Each section is a bespoke function with its own state and layout. There's no way to interactively explore component combinations (icon placement, text content, sizes) — you only see whatever was hardcoded.

We're restructuring it into a modular component explorer where each component lives in its own file and has a controls toolbar for toggling every meaningful combination. This is both a development tool (discover missing variants, test visual quality) and the path to v1.

---

## File Structure

```
app/playground/
  page.tsx                          (slim shell: imports + renders all sections + FloatingControls)
  components/
    constants.ts                    (BACKGROUNDS, variant/theme arrays)
    component-display.tsx           (shared wrapper: header, display area, separator, controls slot)
    controls.tsx                    (TextControl, SegmentedControl primitives)
    badge.tsx
    button.tsx
    button-group.tsx
    accordion.tsx
    alert-dialog.tsx
    avatar.tsx
    checkbox.tsx
    dialog.tsx
    dropdown-menu.tsx
    input.tsx
    kbd.tsx
    label.tsx
    radio-group.tsx
    separator.tsx
    sonner.tsx
    switch.tsx
    textarea.tsx
    toggle.tsx
    toggle-group.tsx
    toolbar.tsx
    tooltip.tsx
```

---

## Implementation Steps

### Step 1: Shared infrastructure

**1a. `constants.ts`** — Extract shared arrays from page.tsx:

- `BACKGROUNDS` (App / Surface 1 / Surface 2)
- All variant/theme/size arrays (`BUTTON_VARIANTS`, `BADGE_THEMES`, etc.)

**1b. `component-display.tsx`** — Shared wrapper replacing `ComponentSection`.

```
+----------------------------------------------------+
| Name     View docs ->       [Background ▾] dropdown |
+----------------------------------------------------+
|                                                      |
|   ... component variants (children) ...              |
|                                                      |
|------------------------------------------------------|
| [Label] [control]  |  [Label] [control]  | ...      |  <- controls toolbar
+----------------------------------------------------+
```

Props:

```tsx
interface ComponentDisplayProps {
  name: string;
  slug: string;
  children: React.ReactNode;
  controls?: React.ReactNode; // fills the toolbar slot
}
```

Key decisions:

- Background state lives inside `ComponentDisplay` (every section needs it, no reason to push it out)
- Background switcher becomes a `DropdownMenu` with `DropdownMenuCheckboxItem` entries, `align="end"`
- Controls toolbar uses the `Toolbar` component for keyboard nav; only renders when `controls` is provided
- Separator divides display area from controls inside the same bordered card

**1c. `controls.tsx`** — Small composable control primitives:

- **`TextControl`** — `<ToolbarGroup>` with `<Label>` + `<Input variant="soft" className="h-7 w-28 text-xs">`
- **`SegmentedControl`** — `<ToolbarGroup>` with `<Label>` + `<ToggleGroup variant="outline" size="sm" spacing={0}>`

These are not a generic knobs abstraction. Each component file composes its own controls JSX from these primitives.

### Step 2: Proof of concept — Badge and Button

Migrate these two first because they're the most controls-rich and will validate the full system.

**`badge.tsx`** — State: `text` (string), `iconMode` (none / with-icon / icon-only)

- Controls: TextControl for label, SegmentedControl for icon mode
- Renders the variant x theme grid, respecting current state

**`button.tsx`** — State: `text` (string), `iconMode` (none / leading / trailing / icon-only), `size` (sm / md / lg)

- Controls: TextControl, SegmentedControl for icon mode, SegmentedControl for size
- When icon-only, size options switch to icon / icon-sm / icon-lg
- Renders the variant x theme grid

### Step 3: Migrate remaining sections

Each component file exports a single function (e.g., `BadgeSection`) that returns `<ComponentDisplay>` with its own state, rendering, and controls.

**Batch 1 — variant grids (benefit from controls):**
toggle, toggle-group, input, textarea, kbd

**Batch 2 — size/state variants:**
avatar, switch, checkbox, radio-group

**Batch 3 — example/compound components (no controls needed initially):**
accordion, dialog, alert-dialog, dropdown-menu, tooltip, toolbar, button-group, separator, label, sonner

Batch 3 components simply omit the `controls` prop — no toolbar renders. They can gain controls later without changing the wrapper.

### Step 4: Slim down page.tsx

Reduce to:

- Imports from `./components/*`
- Page layout shell (title, description, max-w-4xl container)
- Render all sections in order
- `FloatingControls` (theme toggle + radius presets) stays here
- `Toaster` stays here

---

## Key Design Decisions

1. **Controls are ReactNode, not config** — each component composes its own JSX from shared primitives. No meta-framework for describing knobs.
2. **Background state in the wrapper** — eliminates boilerplate from all 21 files.
3. **ToggleGroup for segmented controls** — compact, keyboard-navigable, already exists.
4. **Incremental migration** — old `ComponentSection` and new `ComponentDisplay` coexist. Swap sections one at a time.

## Watch Out For

- **Toolbar keyboard nav vs Input** — the `@base-ui/react/toolbar` may capture arrow keys meant for the text input. Test during step 2; if it conflicts, stop propagation on the input's keydown for arrow keys.
- **ToggleGroup empty value** — guard against empty arrays in `onValueChange` (user deselects current value).
- **DropdownMenu alignment** — use `align="end"` on the background switcher to avoid right-edge overflow.

---

## Critical Files

- `apps/docs/src/app/playground/page.tsx` — current monolith to break up
- `apps/docs/src/components/ui/toolbar.tsx` — used for controls toolbar
- `apps/docs/src/components/ui/toggle-group.tsx` — used for segmented controls
- `apps/docs/src/components/ui/toggle.tsx` — toggleVariants imported by toggle-group
- `apps/docs/src/components/ui/dropdown-menu.tsx` — used for background switcher
- `apps/docs/src/components/ui/input.tsx` — used for text controls
- `apps/docs/src/components/ui/label.tsx` — used for control labels
- `apps/docs/src/components/ui/separator.tsx` — divider between display and controls

## Verification

1. Run `pnpm dev` and navigate to `/playground`
2. Confirm Badge and Button sections render with controls toolbar
3. Test text input updates all variant instances
4. Test icon mode toggles show correct icon placement
5. Test size selector on button
6. Test background switcher dropdown on each section
7. Confirm sections without controls render cleanly (no empty toolbar)
8. Confirm FloatingControls (theme/radius) still work globally
9. Run `pnpm typecheck` to verify no type errors
