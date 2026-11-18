import { Button } from '@/registry/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/registry/ui/popover';
import type { EntrySchema } from '@/playground/lib/types';

export const popoverEntry: EntrySchema = {
  component: 'popover',
  name: 'Popover',
  variants: {
    side: {
      label: 'Side',
      values: ['top', 'right', 'bottom', 'left'],
      default: 'bottom',
    },
    align: {
      label: 'Align',
      values: ['start', 'center', 'end'],
      default: 'center',
    },
  },
  behavior: {
    modal: { type: 'boolean', label: 'Modal', default: false },
    openOnHover: { type: 'boolean', label: 'Open on hover', default: false },
    showCloseButton: { type: 'boolean', label: 'Show close button', default: false },
  },
  content: {
    sideOffset: {
      type: 'string',
      label: 'Side offset',
      default: '4',
    },
    title: {
      type: 'string',
      label: 'Title',
      default: 'Notifications',
    },
    description: {
      type: 'string',
      label: 'Description',
      default: 'You are all caught up.',
    },
  },
  render: function PopoverRender({ variants, behavior, inputs }) {
    const offset = Number(inputs.sideOffset);

    return (
      <Popover modal={behavior.modal as boolean}>
        <PopoverTrigger
          openOnHover={behavior.openOnHover as boolean}
          render={<Button variant="outline">Notifications</Button>}
        />
        <PopoverContent
          side={variants.side as 'top' | 'right' | 'bottom' | 'left'}
          align={variants.align as 'start' | 'center' | 'end'}
          sideOffset={Number.isFinite(offset) ? offset : 4}
          showCloseButton={behavior.showCloseButton as boolean}
        >
          <PopoverHeader>
            <PopoverTitle>{inputs.title as string}</PopoverTitle>
            <PopoverDescription>{inputs.description as string}</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    );
  },
};
