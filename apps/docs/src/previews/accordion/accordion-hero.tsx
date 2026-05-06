import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AccordionHero() {
  return (
    <Accordion defaultValue={['item-1']} className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Ora UI?</AccordionTrigger>
        <AccordionContent>
          Ora UI is a collection of styled, accessible components built on Base UI primitives.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. Every component is built on Base UI, which follows WAI-ARIA authoring practices.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I use it in my project?</AccordionTrigger>
        <AccordionContent>
          Absolutely. Copy the source into your project or install via the CLI.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
