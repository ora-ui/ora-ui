'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/registry/ui/accordion';
import { CheckboxControl } from '@/playground/components/controls';
import { PreviewShell } from '@/playground/components/preview-shell';
import { ToolbarSeparator } from '@/registry/ui/toolbar';

const DEMO_ITEMS = [
  {
    value: 'what',
    trigger: 'What is Ora UI?',
    content:
      'Ora UI is a collection of styled primitives and composable patterns for building products that prioritize accessibility and usability.',
  },
  {
    value: 'how',
    trigger: 'How do I get started?',
    content:
      'Install the package via your preferred package manager, import the components you need, and compose them into your application.',
  },
  {
    value: 'why',
    trigger: 'Why another component library?',
    content:
      'Ora focuses on the details — thoughtful token systems, consistent interaction patterns, and an opinionated visual style that stays out of your way.',
  },
];

export const defaults = {
  multiple: 'false',
  disabled: 'false',
};

function AccordionPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [multiple, setMultiple] = React.useState(searchParams.multiple === 'true');
  const [disabled, setDisabled] = React.useState(searchParams.disabled === 'true');

  const preview = (
    <Accordion multiple={multiple} disabled={disabled} defaultValue={['what']} className="w-96">
      {DEMO_ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <PreviewShell
      preview={preview}
      controls={
        <>
          <CheckboxControl label="Multiple" checked={multiple} onChange={setMultiple} />
          <ToolbarSeparator />
          <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled} />
        </>
      }
      variants={<AccordionVariants />}
    />
  );
}

function AccordionVariants() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Default</span>
          <Accordion defaultValue={['what']} className="w-80">
            {DEMO_ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Multiple open</span>
          <Accordion multiple defaultValue={['what', 'how']} className="w-80">
            {DEMO_ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Disabled</span>
          <Accordion disabled defaultValue={['what']} className="w-80">
            {DEMO_ITEMS.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

const entry = {
  Preview: AccordionPreview,
  Variants: AccordionVariants,
  defaults,
};
export default entry;
