'use client';

import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/ui/accordion';
import type { EntryState, ListItem } from '@/playground/lib/types';

export function AccordionRender({ variants, behavior, inputs }: EntryState) {
  const multiple = behavior.multiple === true;
  const bordered = variants.bordered === true;
  const itemVariant = (variants.itemVariant as 'underline' | 'soft') ?? 'underline';
  const items = (inputs.items as ListItem[]) ?? [];

  const [prevMultiple, setPrevMultiple] = useState(multiple);
  const [resetCount, setResetCount] = useState(0);
  if (prevMultiple !== multiple) {
    setPrevMultiple(multiple);
    if (prevMultiple && !multiple) {
      setResetCount((c) => c + 1);
    }
  }

  return (
    <Accordion
      key={multiple ? 'multiple' : `single-${resetCount}`}
      multiple={multiple}
      bordered={bordered}
      className="w-full max-w-sm"
    >
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`} variant={itemVariant}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
