import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export default function CollapsibleHero() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}
