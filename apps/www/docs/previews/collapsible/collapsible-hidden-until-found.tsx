import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';

export default function CollapsibleHiddenUntilFound() {
  return (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger>Show details</CollapsibleTrigger>
      <CollapsibleContent hiddenUntilFound>
        Your plan renews on the first of each month. Search this page for &quot;renews&quot; to open
        this panel.
      </CollapsibleContent>
    </Collapsible>
  );
}
