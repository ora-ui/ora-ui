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
      name: 'Accordion',
      slug: 'accordion',
      load: () => import('./accordion'),
    },
    {
      name: 'Alert Dialog',
      slug: 'alert-dialog',
      load: () => import('./alert-dialog'),
    },
    {
      name: 'Avatar',
      slug: 'avatar',
      load: () => import('./avatar'),
    },
    {
      name: 'Avatar Group',
      slug: 'avatar-group',
      load: () => import('./avatar-group'),
    },
    {
      name: 'Button',
      slug: 'button',
      load: () => import('./button'),
    },
    {
      name: 'Badge',
      slug: 'badge',
      load: () => import('./badge'),
    },
    {
      name: 'Button Group',
      slug: 'button-group',
      load: () => import('./button-group'),
    },
    {
      name: 'Checkbox',
      slug: 'checkbox',
      load: () => import('./checkbox'),
    },
    {
      name: 'Checkbox Group',
      slug: 'checkbox-group',
      load: () => import('./checkbox-group'),
    },
    {
      name: 'Dropdown Menu',
      slug: 'dropdown-menu',
      load: () => import('./dropdown-menu'),
    },
    {
      name: 'Input',
      slug: 'input',
      load: () => import('./input'),
    },
    {
      name: 'Input Group',
      slug: 'input-group',
      load: () => import('./input-group'),
    },
    {
      name: 'Tabs',
      slug: 'tabs',
      load: () => import('./tabs'),
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
