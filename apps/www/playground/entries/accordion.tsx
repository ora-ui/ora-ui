import type { EntrySchema } from '@/playground/lib/types';
import { AccordionRender } from './accordion-render';

export const accordionEntry: EntrySchema = {
  component: 'accordion',
  name: 'Accordion',
  variants: {
    bordered: {
      type: 'boolean',
      label: 'Bordered',
      default: false,
    },
    itemVariant: {
      values: ['underline', 'soft'],
      label: 'Item style',
      default: 'underline',
    },
    iconPosition: {
      values: ['start', 'end'],
      label: 'Icon position',
      default: 'end',
    },
  },
  behavior: {
    multiple: {
      type: 'boolean',
      label: 'Multiple',
      default: false,
    },
  },
  content: {
    items: {
      type: 'list',
      label: 'Items',
      itemLabel: 'Item',
      itemShape: {
        trigger: { type: 'string', label: 'Trigger', default: 'Section' },
        content: { type: 'string', label: 'Content', default: 'Section content.' },
      },
      default: [
        { trigger: 'Getting started', content: 'Install via the CLI or copy the source.' },
        { trigger: 'Customisation', content: 'Override styles with className.' },
        { trigger: 'Accessibility', content: 'Full keyboard and screen reader support.' },
      ],
    },
  },
  render: AccordionRender,
};
