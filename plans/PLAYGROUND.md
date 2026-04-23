# Playground v2: Component Explorer Shell

## Context

The playground currently renders all component sections in a scrollable list. Navigation requires scrolling to find components, and there's no persistent shell for global controls. We're evolving it into a Storybook-like explorer with fixed layout, sidebar navigation, and URL-based routing — but lightweight and fast because it's just a Next.js route, not a separate build process.

**Goal**: Fast visual verification during development. Switch between components instantly, toggle variants, check themes — all without leaving the playground or waiting for rebuilds.

---

## Architecture Decisions

| Decision           | Choice                                     | Rationale                                                        |
| ------------------ | ------------------------------------------ | ---------------------------------------------------------------- |
| Base               | Evolve existing `/playground` route        | No separate app overhead, stays integrated with docs             |
| Discovery          | Registry file with lazy-loaded configs     | Explicit control over grouping/ordering, decoupled from Fumadocs |
| Layout             | Fixed shell — sidebar left, toolbar bottom | Matches dev tool conventions (VS Code, Storybook)                |
| Routing            | URL-based (`/playground/[component]`)      | Shareable links, browser history works                           |
| View mode          | Single preview + expandable variants panel | Interactive preview is primary, grid is secondary                |
| Global controls    | Sidebar header area                        | Theme, radius — persistent across components                     |
| Component controls | Bottom toolbar                             | Per-component props — contextual                                 |
| State persistence  | URL query params                           | Survives refresh, shareable                                      |
| Sidebar            | shadcn sidebar component                   | Collapsible groups, keyboard nav built-in                        |
| Search             | Filter input in sidebar                    | Simple, always visible                                           |

---

## v1 Scope

### Must Have

1. **Fixed layout shell**
   - Sidebar on left (collapsible)
   - Component preview area (fills remaining space)
   - Bottom toolbar for component controls

2. **Sidebar navigation**
   - Uses shadcn sidebar component
   - Collapsible groups (primitives, blocks, etc.)
   - Filter input to search components
   - Expanded/collapsed state persisted to localStorage

3. **URL-based routing**
   - Route: `/playground/[component]`
   - Dynamic segment loads component from registry
   - Query params persist control state (`?variant=outline&theme=accent`)

4. **Component preview**
   - Single interactive instance as default view
   - Expandable "All Variants" panel (replaces current Overview tab)
   - Background switcher (existing functionality)

5. **Global controls**
   - Theme toggle (light/dark)
   - Radius presets
   - Located in sidebar header or top area

6. **Component controls**
   - Bottom toolbar (existing pattern)
   - Controls specific to current component's API

7. **Registry system**
   - Central manifest for component discovery
   - Lazy-loaded component configs
   - Supports grouping (primitives, blocks, etc.)

### Deferred

- Plugin system (color blindness sim, focus order overlay)
- Configurable toolbar position
- Code viewing
- Responsive viewport controls
- Forced state toggles (hover, focus, active)
- Keyboard shortcuts / command palette

---

## File Structure

```
apps/docs/src/app/playground/
├── layout.tsx                    # Fixed shell with sidebar
├── page.tsx                      # Index redirect or welcome
├── [component]/
│   └── page.tsx                  # Dynamic route, loads from registry
├── components/
│   ├── sidebar.tsx               # Sidebar with groups + filter
│   ├── preview-shell.tsx         # Preview area + bottom toolbar
│   ├── variants-panel.tsx        # Expandable all-variants grid
│   ├── global-controls.tsx       # Theme, radius controls
│   ├── controls.tsx              # Existing control primitives
│   ├── component-display.tsx     # Keep for variants grid rendering
│   └── constants.ts              # Existing constants
├── registry/
│   ├── index.ts                  # Registry manifest + types
│   └── entries/
│       ├── button.tsx            # Button playground config
│       ├── badge.tsx             # Badge playground config
│       └── ...                   # One per component
└── CLAUDE.md                     # Context for AI assistance
```

---

## Registry Design

### Manifest (`registry/index.ts`)

```ts
export interface PlaygroundEntry {
  /** Display name in sidebar */
  name: string;
  /** URL slug */
  slug: string;
  /** Lazy-loaded component */
  load: () => Promise<{ default: PlaygroundComponent }>;
}

export interface PlaygroundComponent {
  /** The interactive preview with controls */
  Preview: React.ComponentType<{ searchParams: Record<string, string> }>;
  /** The all-variants grid */
  Variants: React.ComponentType;
  /** Default control values (for URL state) */
  defaults: Record<string, string>;
}

export const registry: Record<string, PlaygroundEntry[]> = {
  primitives: [
    { name: 'Button', slug: 'button', load: () => import('./entries/button') },
    { name: 'Badge', slug: 'badge', load: () => import('./entries/badge') },
    // ...
  ],
  blocks: [
    // Future: auth-form, settings-panel, etc.
  ],
};
```

### Entry Example (`registry/entries/button.tsx`)

```tsx
import { Button } from '@/components/ui/button';
import { BUTTON_VARIANTS, BUTTON_THEMES } from '../../components/constants';

export const defaults = {
  variant: 'solid',
  theme: 'gray',
  label: 'Button',
};

export function Preview({ searchParams }: { searchParams: Record<string, string> }) {
  const variant = searchParams.variant ?? defaults.variant;
  const theme = searchParams.theme ?? defaults.theme;
  const label = searchParams.label ?? defaults.label;

  return (
    <PreviewShell
      preview={
        <Button variant={variant} theme={theme}>
          {label}
        </Button>
      }
      controls={/* variant, theme, label controls */}
    />
  );
}

export function Variants() {
  return <div className="grid ...">{/* Existing variant × theme grid */}</div>;
}
```

---

## URL State

Use `nuqs` or native `useSearchParams` for URL persistence:

```
/playground/button?variant=outline&theme=accent&label=Click%20me
```

When navigating between components, each component reads its own defaults. The URL reflects the current component's state.

---

## Layout Shell

```
+------------------+----------------------------------------+
|  [Ora UI]        |                                        |
|  [Filter...]     |                                        |
|------------------|                                        |
|  Primitives  ▾   |          Component Preview             |
|    Button        |                                        |
|    Badge         |                                        |
|    Input         |                                        |
|    ...           |                                        |
|  Blocks  ▾       |                                        |
|    (empty)       |                                        |
|                  |----------------------------------------|
|                  | [variant] [theme] [label]   [▼ All]   |
|  [Theme] [Radius]+----------------------------------------+
```

- Sidebar: shadcn sidebar with collapsible groups
- Preview: centered component instance
- Bottom toolbar: component controls + "All Variants" expand button
- Global controls: theme/radius in sidebar footer

---

## Migration Strategy

### Phase 1: Shell + Registry Infrastructure

1. Install/build shadcn sidebar
2. Create layout shell with sidebar structure
3. Set up registry with types
4. Create dynamic `[component]/page.tsx` route
5. Migrate one component (button) to new registry format

### Phase 2: Migrate Components

1. Convert existing playground sections to registry entries
2. Keep existing `ComponentDisplay` for variants grid
3. Wire up URL state persistence

### Phase 3: Polish

1. Filter input in sidebar
2. localStorage for collapsed groups
3. Expandable variants panel
4. Global controls in sidebar

---

## Key Dependencies

- `@shadcn/ui` sidebar component (or build custom)
- `nuqs` for URL state (optional, can use native)
- Existing components: Toolbar, ToggleGroup, Input, DropdownMenu

---

## Implementation Notes

### What Was Built (v1 Complete)

✅ Fixed layout shell with sidebar navigation
✅ Registry system with lazy-loaded entries
✅ URL-based routing (`/playground/[component]`)
✅ Component preview with expandable variants panel
✅ Global controls (theme, radius) in sidebar footer
✅ Component-specific controls in bottom toolbar
✅ Filter input for component search
✅ 6 components migrated (button, badge, button-group, checkbox, dropdown-menu, tabs)
✅ Suspense boundary with promise caching for dynamic imports

### Deferred to v2

- URL state persistence for component controls (`?variant=outline&theme=accent`)
  - Controls currently use local useState, state doesn't persist to URL
  - Trade-off: simpler implementation, but loses shareable links
- Background selection persistence (localStorage or URL)
- Sidebar collapsed state persistence

### Technical Decisions

**ComponentLoader Pattern**
Next.js server components can't use dynamic imports natively. Solution: Client-side ComponentLoader with:

- React's `use()` hook to unwrap promises
- Promise cache (Map) to avoid "uncached promise" warnings
- Suspense boundary for loading states
- Result: Clean 30-line component, no useEffect/useState complexity

**No Static Site Generation**
Playground is dev-only, runs in development mode with Next.js dev server. `generateStaticParams()` present but not used in production builds.

## Verification

1. Navigate to `/playground` — redirects to first component (button)
2. Click component in sidebar — URL updates to `/playground/[slug]`
3. Toggle controls — updates preview in real-time (state local, not in URL)
4. Filter input — narrows visible components
5. Toggle theme — applies globally across all components
6. Change radius — updates all components with new border radius
7. Expand "All Variants" — shows curated component showcase
8. Navigate between components — lazy loads each entry on demand
9. `pnpm typecheck` passes
