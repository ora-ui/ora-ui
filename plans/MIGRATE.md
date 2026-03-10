# Ora UI Migration - Process Guide

**From**: Aura UI (Stitches + Radix) → **To**: Ora UI (Tailwind + shadcn patterns)
**Version**: v0.0.5-alpha.3 → v0.1.0 (breaking)

## Migration Philosophy

Ora UI v0.1.0 = shadcn components via custom registry URLs. NOT "Aura ported to Tailwind" but "shadcn components installable with URLs".

**Critical Rule**: Start with shadcn implementation. Match API exactly. Prefer Base UI when available.

**Installation Pattern**:
```bash
npx shadcn@latest init
npx shadcn@latest add "https://ora-ui.com/r/button.json"
```

## Why Match shadcn Exactly

1. Familiarity - users know shadcn patterns
2. Composability - mix shadcn + Ora UI
3. Documentation - reference shadcn docs
4. Community - leverage ecosystem
5. Standards - benefit from proven decisions

## Key Changes

- Stitches → Tailwind CSS
- npm package → shadcn CLI + registry URLs
- Styled components → JSX with className
- Storybook → MDX docs site
- Variants API → class-variance-authority (cva)
- `as` prop → `asChild` pattern
- Remove: `colorScheme`, `css` props
- Remove: Box, Flex, Grid, Typography, Link, IconButton

## Component Inventory

**Migrate (20 total)**:
Badge, Button, Input, Kbd, Label, Textarea, Checkbox, RadioGroup, Switch, Dialog, AlertDialog, DropdownMenu, Tooltip, Accordion, Toast, Toolbar, Toggle, ToggleGroup, AspectRatio, Avatar, Separator, VisuallyHidden

**Remove (7)**:
Box, Container, Flex, Grid, Typography, IconButton, Link

## Component Migration Workflow

**IMPORTANT**: Use `/shadcn` skill when migrating components to leverage shadcn patterns and registry.

**CRITICAL RULE**: Complete and commit **one component at a time**. After each component is done, update the checklist in `progress.txt` to check it off before moving to the next.

### Per-Component Process

1. **Install shadcn counterpart into docs app**
   ```bash
   # Run from apps/docs/
   npx shadcn@latest add [component]
   ```
   - Output goes to `apps/docs/src/components/ui/` (create the `ui/` folder if it doesn't exist)
   - Use `--base-ui` flag if the component supports it (prefer Base UI)

2. **Create registry JSON**
   ```json
   {
     "name": "button",
     "type": "registry:ui",
     "files": [{
       "path": "components/ui/button.tsx",
       "content": "...full source...",
       "type": "registry:ui"
     }],
     "dependencies": ["class-variance-authority", "@radix-ui/react-slot"],
     "registryDependencies": []
   }
   ```
   - Save to `apps/docs/public/r/[component].json`
   - Test: `npx shadcn add "http://localhost:3000/r/[component].json"`

3. **Commit the component**
   ```bash
   git add .
   git commit -m "feat: add [component] shadcn component"
   ```

4. **Update progress.txt checklist**
   - Check off the completed component in the checklist
   - Do this before starting the next component

5. **Prepare for docs**
   - Component ready for MDX
   - Installation command ready

## Migration Order

1. Infrastructure (Tailwind, docs, registry)
2. Utils (cn helper)
3. Simple (Badge, Kbd, Button, Input, Label, Textarea)
4. Form (Checkbox, RadioGroup, Switch)
5. Overlay (Dialog, AlertDialog, DropdownMenu, Tooltip)
6. Complex (Accordion, Toast, Toolbar, Toggle variants)
7. Specialized (Avatar, AspectRatio, Separator, VisuallyHidden)
8. Docs infrastructure
9. Cleanup & polish

**Note**: Break into ~9-12 commits

## Project Structure

```
ora-ui/
├── apps/docs/              # Next.js docs site
│   ├── content/docs/
│   ├── components/ui/
│   └── public/r/           # Registry JSONs
├── src/components/
│   ├── ui/                 # Component source
│   └── lib/utils.ts        # cn() helper
├── components.json
├── tailwind.config.ts
└── postcss.config.js
```

**Remove**: packages/react/, .storybook/, _templates/

## Deprecations

### Files to Remove
- packages/react/src/theme/ (Stitches config)
- packages/react/src/layout/ (use Tailwind)
- packages/react/src/typography/ (use Tailwind)
- packages/react/src/link/ (use native <a>)
- packages/react/src/icon-button/ (use Button asChild)
- .storybook/ (replaced by docs)
- _templates/ (use shadcn CLI)

### Dependencies

**Remove Production**:
- @stitches/react
- All @radix-ui/* from dependencies

**Remove Dev**:
- tsup (no bundling)
- @storybook/* packages

**Add Dev**:
- tailwindcss, autoprefixer, postcss
- class-variance-authority, clsx, tailwind-merge
- @radix-ui/react-slot, @radix-ui/react-icons

## Base UI Preference

When shadcn supports Base UI variant, **prefer Base UI**:
- Base UI = Radix successor (official, modern)
- Better performance, smaller bundle
- Check shadcn docs per component

**Install**: `npx shadcn add [component] --base-ui`

## Task Breakdown

### Phase 1: Infrastructure
- Monorepo structure (apps/docs/, src/components/)
- Tailwind config, PostCSS, globals.css
- src/lib/utils.ts (cn + helpers)
- components.json
- Docs site boilerplate
- apps/docs/public/r/ for registry
- Registry generation script

### Phase 2-6: Component Migration
- Simple components (6)
- Form components (3)
- Overlay components (4)
- Complex components (5)
- Specialized (4)

### Phase 7: Registry Setup
- Generate registry JSONs
- Test with shadcn CLI
- Verify dependencies

### Phase 8: Docs Infrastructure
- Content structure
- Component page templates
- MDX rendering
- Example/playground infrastructure

### Phase 9: Cleanup
- Update README
- Write MIGRATION_FROM_AURA.md
- Delete legacy code
- Update package.json scripts
- Deprecate @aura-ui/react on npm
- Deploy docs to ora-ui.com

## Key Decisions

1. Layout components → REMOVE (use Tailwind)
2. Typography component → REMOVE (use Tailwind)
3. colorScheme prop → REMOVE (use CSS vars + className)
4. Polymorphic `as` → Replace with `asChild`
5. Testing → Add AFTER migration
6. Registry → Static JSON at ora-ui.com/r/
7. CLI → NO custom CLI (use shadcn CLI)
8. npm package → Deprecate with notice
9. Migration approach → Match shadcn exactly
10. Base UI → Prefer when available
11. Version → v0.1.0 (breaking)

## Utils Migration

**Keep**: ariaAttr, dataAttr helpers
**Remove**: polymorphic types (use asChild), compact, getValidChildren
**Add**: cn() helper (clsx + tailwind-merge)

## Success Criteria

- 22 components migrated following shadcn exactly
- Base UI used where supported
- Registry JSONs at ora-ui.com/r/
- Installable via shadcn CLI
- Docs infrastructure ready
- README + MIGRATION_FROM_AURA.md written
- v0.1.0 tagged
- @aura-ui/react deprecated
- Legacy code removed
- Components verified with shadcn CLI locally
