'use client';

import { useState, type ComponentType } from 'react';
import { CursorIcon, MagicWandIcon, PenNibIcon, SquareIcon } from '@phosphor-icons/react/dist/ssr';

import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';
import type { EntryState } from '@/playground/lib/types';

type PhosphorIcon = ComponentType<{ className?: string; weight?: 'regular' | 'fill' }>;

// In ghost variant items, swap to filled icon weight when pressed. Detected
// via the `group/toggle` class on Toggle + aria-pressed CSS variant.
function ToolIcon({ Icon, fillOnPressed }: { Icon: PhosphorIcon; fillOnPressed: boolean }) {
  if (!fillOnPressed) return <Icon />;
  return (
    <>
      <Icon className="group-aria-pressed/toggle:hidden" />
      <Icon weight="fill" className="hidden group-aria-pressed/toggle:inline-block" />
    </>
  );
}

export function ToggleGroupRender({ variants, behavior }: EntryState) {
  const variant = variants.variant as 'none' | 'outline' | 'surface' | 'soft' | 'solid';
  const itemVariant = variants.itemVariant as
    | 'soft'
    | 'outline'
    | 'surface'
    | 'ghost'
    | 'solid'
    | 'on-solid';
  const theme = variants.theme as 'gray' | 'accent';
  const orientation = (variants.orientation as 'horizontal' | 'vertical') ?? 'horizontal';
  const attached = behavior.attached === 'true';
  const multiple = behavior.multiple === 'true';

  const ghost = itemVariant === 'ghost';

  const [value, setValue] = useState<string[]>(['cursor']);
  const themeFor = (v: string) => (theme !== 'gray' && value.includes(v) ? theme : undefined);

  return (
    <ToggleGroup
      variant={variant}
      itemVariant={itemVariant}
      orientation={orientation}
      attached={attached}
      multiple={multiple}
      value={value}
      onValueChange={setValue}
    >
      <ToggleGroupItem value="cursor" aria-label="Cursor" data-theme={themeFor('cursor')}>
        <ToolIcon Icon={CursorIcon} fillOnPressed={ghost} />
      </ToggleGroupItem>
      <ToggleGroupItem value="square" aria-label="Square" data-theme={themeFor('square')}>
        <ToolIcon Icon={SquareIcon} fillOnPressed={ghost} />
      </ToggleGroupItem>
      <ToggleGroupItem value="pen" aria-label="Pen" data-theme={themeFor('pen')}>
        <ToolIcon Icon={PenNibIcon} fillOnPressed={ghost} />
      </ToggleGroupItem>
      <ToggleGroupItem value="magic" aria-label="Magic wand" data-theme={themeFor('magic')}>
        <ToolIcon Icon={MagicWandIcon} fillOnPressed={ghost} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
