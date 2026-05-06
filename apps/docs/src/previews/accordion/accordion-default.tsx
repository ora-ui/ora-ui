import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function AccordionDefault() {
  return (
    <Accordion className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>Getting started</AccordionTrigger>
        <AccordionContent>
          Install the component using the CLI or copy the source into your project.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Customisation</AccordionTrigger>
        <AccordionContent>
          Override styles with className or extend the component with your own variants.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Accessibility</AccordionTrigger>
        <AccordionContent>
          Full keyboard navigation and screen reader support out of the box.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
