import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/ui/accordion';

export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={['item-1', 'item-2']} className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>Design tokens</AccordionTrigger>
        <AccordionContent>
          Colour, spacing, and typography tokens are defined in the Tailwind config.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Component variants</AccordionTrigger>
        <AccordionContent>
          Use className to apply variant styles, or compose with CVA for named variants.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Dark mode</AccordionTrigger>
        <AccordionContent>
          All semantic tokens automatically adapt when the dark-mode class is applied.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
