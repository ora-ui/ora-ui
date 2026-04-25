import type { ComponentType } from 'react';

/* ---------- Types ---------- */

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
  Preview: ComponentType<{ searchParams: Record<string, string> }>;
  /** The all-variants grid */
  Variants: ComponentType;
  /** Default control values (for URL state) */
  defaults: Record<string, string>;
}

/* ---------- Registry ---------- */

export const registry: Record<string, PlaygroundEntry[]> = {
  primitives: [
    {
      name: 'Button',
      slug: 'button',
      load: () => import('./entries/button'),
    },
    {
      name: 'Badge',
      slug: 'badge',
      load: () => import('./entries/badge'),
    },
    {
      name: 'Button Group',
      slug: 'button-group',
      load: () => import('./entries/button-group'),
    },
    {
      name: 'Checkbox',
      slug: 'checkbox',
      load: () => import('./entries/checkbox'),
    },
    {
      name: 'Checkbox Group',
      slug: 'checkbox-group',
      load: () => import('./entries/checkbox-group'),
    },
    {
      name: 'Dropdown Menu',
      slug: 'dropdown-menu',
      load: () => import('./entries/dropdown-menu'),
    },
    {
      name: 'Tabs',
      slug: 'tabs',
      load: () => import('./entries/tabs'),
    },
  ],
  blocks: [],
};

/* ---------- Helpers ---------- */

export function getAllEntries(): PlaygroundEntry[] {
  return Object.values(registry).flat();
}

export function getEntryBySlug(slug: string): PlaygroundEntry | undefined {
  return getAllEntries().find((entry) => entry.slug === slug);
}
