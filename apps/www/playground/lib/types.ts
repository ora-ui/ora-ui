import type { ComponentType } from 'react';

export type VariantSpec =
  | {
      values: readonly string[];
      label?: string;
      default: string;
    }
  | {
      type: 'boolean';
      label?: string;
      default: boolean;
    };

export type ItemShape = Record<string, ItemFieldSpec>;

export type ItemFieldSpec =
  | { type: 'string'; label?: string; default: string }
  | { type: 'select'; values: readonly string[]; label?: string; default: string };

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
    }
  | {
      type: 'list';
      label?: string;
      itemLabel?: string;
      itemShape: ItemShape;
      default: ReadonlyArray<Record<string, string>>;
      visibleWhen?: (inputs: Record<string, unknown>) => boolean;
    };

export type ListItem = Record<string, string>;

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
  behavior?: Record<string, VariantSpec>;
  content?: ContentSpec;
  groups?: readonly ContentGroup[];
  render: ComponentType<EntryState>;
};

export type EntryState = {
  variants: Record<string, string | boolean>;
  behavior: Record<string, string | boolean>;
  inputs: Record<string, unknown>;
};
