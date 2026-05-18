import type { ReactNode } from 'react';

export type VariantSpec = {
  values: readonly string[];
  label?: string;
  default: string;
};

export type EntrySchema = {
  component: string;
  name: string;
  variants: Record<string, VariantSpec>;
  render: (state: EntryState) => ReactNode;
};

export type EntryState = {
  variants: Record<string, string>;
};

export function defaultState(schema: EntrySchema): EntryState {
  const variants: Record<string, string> = {};
  for (const [key, spec] of Object.entries(schema.variants)) {
    variants[key] = spec.default;
  }
  return { variants };
}
