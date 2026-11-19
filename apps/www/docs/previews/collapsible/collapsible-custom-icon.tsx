import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export default function CollapsibleCustomIcon() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger>
        Show details
        <PlusIcon
          data-slot="collapsible-trigger-icon"
          data-when="collapsed"
          className="size-4 shrink-0 text-secondary"
        />
        <MinusIcon
          data-slot="collapsible-trigger-icon"
          data-when="expanded"
          className="size-4 shrink-0 text-secondary"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}
