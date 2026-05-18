import { createElement } from 'react';
import { Button } from '@/registry/ui/button';
import type { EntrySchema } from '../types';

export const buttonEntry: EntrySchema = {
  component: 'button',
  name: 'Button',
  variants: {
    variant: {
      values: ['solid', 'outline', 'surface', 'soft', 'ghost'],
      label: 'Variant',
      default: 'solid',
    },
    size: {
      values: ['sm', 'md', 'lg', 'icon', 'icon-sm', 'icon-lg'],
      label: 'Size',
      default: 'md',
    },
    theme: {
      values: ['gray', 'accent', 'destructive'],
      label: 'Theme',
      default: 'gray',
    },
  },
  render: ({ variants }) =>
    createElement(
      Button,
      {
        variant: variants.variant as 'solid' | 'outline' | 'surface' | 'soft' | 'ghost',
        size: variants.size as 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg',
        theme: variants.theme,
      },
      'Button'
    ),
};
