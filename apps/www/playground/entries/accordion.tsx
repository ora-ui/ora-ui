import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/ui/accordion';
import type { EntrySchema, ListItem } from '@/playground/lib/types';

export const accordionEntry: EntrySchema = {
  component: 'accordion',
  name: 'Accordion',
  variants: {},
  behavior: {
    mode: {
      values: ['single', 'multiple'],
      label: 'Mode',
      default: 'single',
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
  render: ({ behavior, inputs }) => {
    const mode = behavior.mode;
    const multiple = mode === 'multiple';
    const items = (inputs.items as ListItem[]) ?? [];

    return (
      <Accordion key={mode} multiple={multiple} className="w-full max-w-sm">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  },
};
