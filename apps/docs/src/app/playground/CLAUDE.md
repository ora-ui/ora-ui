# Playground v2 Context

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
│   ├── component-display.tsx     # Legacy - kept for reference
│   └── constants.ts              # Shared constants
└── registry/
    ├── index.ts                  # Registry manifest + types
    └── entries/                  # One file per component
        ├── button.tsx
        ├── badge.tsx
        └── ...
```

## Adding a New Component

1. Create a new file in `registry/entries/[component].tsx`
2. Export a default object with `{ Preview, Variants, defaults }`
3. Add the entry to the registry in `registry/index.ts`

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

See `registry/entries/button.tsx` as the model implementation for new components.
