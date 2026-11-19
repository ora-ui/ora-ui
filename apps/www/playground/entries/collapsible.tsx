import type { EntrySchema } from '@/playground/lib/types';
import { CollapsibleRender } from './collapsible-render';

export const collapsibleEntry: EntrySchema = {
  component: 'collapsible',
  name: 'Collapsible',
  variants: {
    variant: {
      values: ['underline', 'soft'],
      label: 'Variant',
      default: 'underline',
    },
    iconPosition: {
      values: ['start', 'end'],
      label: 'Icon position',
      default: 'end',
    },
  },
  behavior: {
    defaultOpen: {
      values: ['false', 'true'],
      label: 'Default open',
      default: 'false',
    },
    disabled: {
      values: ['false', 'true'],
      label: 'Disabled',
      default: 'false',
    },
    hiddenUntilFound: {
      values: ['false', 'true'],
      label: 'Hidden until found',
      default: 'false',
    },
  },
  content: {
    trigger: { type: 'string', label: 'Trigger', default: 'Show details' },
    content: {
      type: 'string',
      label: 'Content',
      default: 'Your plan renews on the first of each month. You can cancel at any time.',
    },
  },
  render: CollapsibleRender,
};
