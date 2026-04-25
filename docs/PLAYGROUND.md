# Playground

The playground is a Storybook-like component explorer with fixed layout, sidebar navigation, and URL-based routing — but lightweight and fast as a Next.js route.

## Structure

```
apps/docs/src/app/playground/
├── layout.tsx                    # Fixed shell with sidebar
├── page.tsx                      # Index redirect to first component
├── [component]/
│   └── page.tsx                  # Dynamic route, loads from registry
├── components/
│   ├── playground-sidebar.tsx    # Sidebar with groups + filter
│   ├── preview-shell.tsx         # Preview area + bottom toolbar
│   ├── global-controls.tsx       # Theme, radius controls
│   ├── controls.tsx              # Control primitives (text, select, etc.)
│   ├── component-display.tsx     # DEPRECATED - do not use
│   ├── *.tsx                     # DEPRECATED - legacy component files
│   └── constants.ts              # Shared constants
└── registry/
    ├── index.ts                  # Registry manifest + types
    └── entries/                  # ✅ ADD NEW COMPONENTS HERE
        ├── button.tsx
        ├── badge.tsx
        ├── checkbox.tsx
        ├── checkbox-group.tsx
        └── ...
```

## IMPORTANT: Where to Add/Update Playground Components

**✅ CORRECT**: Add new playground components to `apps/docs/src/app/playground/registry/entries/[component].tsx`

**❌ DEPRECATED**: The old component files in `apps/docs/src/app/playground/components/` directory (button.tsx, badge.tsx, checkbox.tsx, etc.) are legacy and should NOT be updated. They are kept for reference only.

When working with playground components:

- Always work in `registry/entries/`
- Update the registry manifest in `registry/index.ts`
- Never modify the old component files in `components/` (except constants.ts and control primitives)

## Adding a New Component to the Playground

1. Create a new file in `apps/docs/src/app/playground/registry/entries/[component].tsx`
2. Export a default object with `{ Preview, Variants, defaults }`
3. Add the entry to the registry in `apps/docs/src/app/playground/registry/index.ts`
4. Update `apps/docs/src/app/playground/components/constants.ts` if new variant/theme/size constants are needed

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

See `apps/docs/src/app/playground/registry/entries/button.tsx` or `apps/docs/src/app/playground/registry/entries/checkbox.tsx` as model implementations for new components.

## Component Implementation Guidelines

The playground entries in `registry/entries/` should only handle the preview interface, controls, and variants showcase. The actual component implementation lives in `apps/docs/src/components/ui/`.

When implementing the actual UI components (not playground entries), follow the patterns in:

- [Component Conventions](conventions/INDEX.md) — Theming, CVA, variants
- [Token System](conventions/TOKEN-SYSTEM.md) — Semantic tokens and usage
- [Component Guide](COMPONENT-GUIDE.md) — Step-by-step direction for building components
