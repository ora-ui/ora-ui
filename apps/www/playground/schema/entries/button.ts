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
  },
  render: ({ variants }) =>
    createElement(
      Button,
      { variant: variants.variant as 'solid' | 'outline' | 'surface' | 'soft' | 'ghost' },
      'Button'
    ),
};
