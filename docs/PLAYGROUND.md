# Playground

The playground is a Storybook-like component explorer with fixed layout, sidebar navigation, and URL-based routing — but lightweight and fast as a Next.js route.

## Structure

```
apps/www/playground/
├── entries/                     # Playground component entries (index.ts is the manifest)
│   ├── index.ts                 # Registry manifest + types
│   ├── button.tsx
│   ├── badge.tsx
│   ├── checkbox.tsx
│   └── ...
└── components/                  # Shell components
    ├── playground-sidebar.tsx   # Sidebar with groups + filter
    ├── preview-shell.tsx        # Preview area + bottom toolbar
    ├── global-controls.tsx      # Theme, radius controls
    ├── controls.tsx             # Control primitives (text, select, etc.)
    └── constants.ts             # Shared constants

apps/www/app/playground/         # Route handlers (separate from playground/)
├── layout.tsx                   # Fixed shell with sidebar
├── page.tsx                     # Index redirect to first component
└── [component]/
    └── page.tsx                 # Dynamic route, loads from registry
```

## IMPORTANT: Where to Add/Update Playground Components

**✅ CORRECT**: Add new playground components to `apps/www/playground/entries/[component].tsx`

When working with playground components:

- Add entries in `apps/www/playground/entries/`
- Update the registry manifest in `apps/www/playground/entries/index.ts`
- Shell components are in `apps/www/playground/components/` (do not add component files here)

## Adding a New Component to the Playground

1. Create a new file in `apps/www/playground/entries/[component].tsx`
2. Export a default object with `{ Preview, Variants, defaults }`
3. Add the entry to the registry in `apps/www/playground/entries/index.ts`
4. Update `apps/www/playground/components/constants.ts` if new variant/theme/size constants are needed

### Registry Entry Structure

```tsx
export const defaults = {
  variant: 'solid',
  theme: 'gray',
  // ... default control values
};

function ComponentPreview({ searchParams }: { searchParams: Record<string, string> }) {
  // Read from searchParams, fallback to defaults
  // Render PreviewShell with preview, controls, and variants
}

function ComponentVariants() {
  // Curated showcase of component configurations
}

export default {
  Preview: ComponentPreview,
  Variants: ComponentVariants,
  defaults,
};
```

## Key Patterns

- **PreviewShell**: Wraps the interactive preview with controls and variants panel
- **Registry**: Central manifest for lazy-loaded component configurations
- **URL State**: Query params persist control state (`/playground/button?variant=outline`)
- **Global Controls**: Theme/radius in sidebar footer, applies across all components

## Reference

See `apps/www/playground/entries/button.tsx` or `apps/www/playground/entries/checkbox.tsx` as model implementations for new components.

## Component Implementation Guidelines

The playground entries in `apps/www/playground/entries/` should only handle the preview interface, controls, and variants showcase. The actual component implementation lives in `apps/www/src/components/ui/`.

When implementing the actual UI components (not playground entries), follow the patterns in:

- [Component Conventions](conventions/INDEX.md) — Theming, CVA, variants
- [Token System](conventions/TOKEN-SYSTEM.md) — Semantic tokens and usage
- [Component Guide](COMPONENT-GUIDE.md) — Step-by-step direction for building components
