'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/ui/collapsible';
import type { EntryState } from '@/playground/lib/types';

export function CollapsibleRender({ variants, behavior, inputs }: EntryState) {
  const variant = (variants.variant as 'underline' | 'soft') ?? 'underline';
  const iconPosition = (variants.iconPosition as 'start' | 'end') ?? 'end';
  const defaultOpen = behavior.defaultOpen === 'true';
  const disabled = behavior.disabled === 'true';
  const hiddenUntilFound = behavior.hiddenUntilFound === 'true';

  return (
    <Collapsible
      key={`${defaultOpen}-${hiddenUntilFound}`}
      variant={variant}
      defaultOpen={defaultOpen}
      disabled={disabled}
      className="w-full max-w-sm"
    >
      <CollapsibleTrigger iconPosition={iconPosition}>{String(inputs.trigger)}</CollapsibleTrigger>
      <CollapsibleContent hiddenUntilFound={hiddenUntilFound}>
        {String(inputs.content)}
      </CollapsibleContent>
    </Collapsible>
  );
}
