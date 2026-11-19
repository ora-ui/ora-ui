import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export function CollapsibleUnderline() {
  return (
    <Collapsible variant="underline" className="w-full max-w-sm">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}

export function CollapsibleSoft() {
  return (
    <Collapsible variant="soft" className="w-full max-w-sm">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CollapsibleUnderline;
