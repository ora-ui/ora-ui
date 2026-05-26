'use client';

import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@phosphor-icons/react/dist/ssr';

import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';
import type { EntryState } from '@/playground/lib/types';

export function ToggleGroupRender({ variants, behavior }: EntryState) {
  const variant = variants.variant as 'none' | 'outline' | 'surface' | 'soft' | 'solid';
  const itemVariant = variants.itemVariant as
    | 'soft'
    | 'outline'
    | 'surface'
    | 'ghost'
    | 'solid'
    | 'on-solid';
  const orientation = (variants.orientation as 'horizontal' | 'vertical') ?? 'horizontal';
  const attached = behavior.attached === 'true';
  const multiple = behavior.multiple === 'true';

  return (
    <ToggleGroup
      variant={variant}
      itemVariant={itemVariant}
      orientation={orientation}
      attached={attached}
      multiple={multiple}
      defaultValue={['left']}
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRightIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Align justify">
        <TextAlignJustifyIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
