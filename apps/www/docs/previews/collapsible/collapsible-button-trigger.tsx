import { Button } from '@/registry/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export default function CollapsibleButtonTrigger() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger
        render={<Button variant="outline" />}
        className="w-auto in-data-[variant=underline]:hover:no-underline"
      >
        Show details
      </CollapsibleTrigger>
      <CollapsibleContent>
        Your plan renews on the first of each month. You can cancel at any time.
      </CollapsibleContent>
    </Collapsible>
  );
}
