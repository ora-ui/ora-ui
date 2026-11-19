import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export function CollapsibleEnd() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger iconPosition="end">Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}

export function CollapsibleStart() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger iconPosition="start">Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CollapsibleEnd;
