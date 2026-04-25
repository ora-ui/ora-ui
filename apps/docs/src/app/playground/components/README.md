# ⚠️ DEPRECATED: Legacy Playground Components

**DO NOT UPDATE OR ADD NEW COMPONENTS HERE**

This directory contains legacy playground component implementations that have been superseded by the registry system.

## Where to Work Instead

✅ **Add/update playground components here**: `../registry/entries/`

The following files in this directory are **deprecated** and kept for reference only:

- `button.tsx`
- `badge.tsx`
- `button-group.tsx`
- `checkbox.tsx`
- `dropdown-menu.tsx`
- `tabs.tsx`
- `component-display.tsx`

## Active Files

The following files are still actively used:

- `constants.ts` — Shared variant/theme/size constants
- `controls.tsx` — Control primitives (SelectControl, TextControl, etc.)
- `preview-shell.tsx` — Preview wrapper component
- `playground-sidebar.tsx` — Sidebar navigation
- `global-controls.tsx` — Global theme/radius controls

## Migration Guide

All new playground components should be created in `../registry/entries/[component].tsx` following the pattern:

```tsx
export const defaults = {
  variant: 'solid',
  theme: 'gray',
  // ... control defaults
};

function ComponentPreview({ searchParams }) {
  // Interactive preview with controls
}

function ComponentVariants() {
  // Curated showcase
}

export default {
  Preview: ComponentPreview,
  Variants: ComponentVariants,
  defaults,
};
```

See `/docs/PLAYGROUND.md` for full documentation.
