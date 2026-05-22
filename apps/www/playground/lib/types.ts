import type { ReactNode } from 'react';

export type VariantSpec = {
  values: readonly string[];
  label?: string;
  default: string;
};

export type InputSpec =
  | {
      type: 'string';
      label?: string;
      default: string;
      visibleWhen?: (inputs: Record<string, unknown>) => boolean;
    }
  | {
      type: 'boolean';
      label?: string;
      default: boolean;
      visibleWhen?: (inputs: Record<string, unknown>) => boolean;
    }
  | {
      type: 'select';
      values: readonly string[];
      label?: string;
      default: string;
      visibleWhen?: (inputs: Record<string, unknown>) => boolean;
    };

export type ContentSpec = Record<string, InputSpec>;

export type ContentGroup = {
  label: string;
  toggleKey: string;
  children: readonly string[];
};

export type EntrySchema = {
  component: string;
  name: string;
  variants: Record<string, VariantSpec>;
  content?: ContentSpec;
  groups?: readonly ContentGroup[];
  render: (state: EntryState) => ReactNode;
};

export type EntryState = {
  variants: Record<string, string>;
  inputs: Record<string, unknown>;
};
