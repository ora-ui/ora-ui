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

const TOOLS = [
  { value: 'move', label: 'Move', Icon: CursorIcon },
  { value: 'rectangle', label: 'Rectangle', Icon: SquareIcon },
  { value: 'pen', label: 'Pen', Icon: PenNibIcon },
  { value: 'wand', label: 'Wand', Icon: MagicWandIcon },
] as const;

export function ToggleGroupRender({ variants, behavior, inputs }: EntryState) {
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
  const layout = (inputs.layout as 'icon' | 'text-icon' | 'text') ?? 'icon';

  const ghost = itemVariant === 'ghost';
  const showIcon = layout !== 'text';
  const showLabel = layout !== 'icon';

  const [value, setValue] = useState<string[]>(['move']);
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
      {TOOLS.map(({ value: v, label, Icon }) => (
        <ToggleGroupItem
          key={v}
          value={v}
          aria-label={showLabel ? undefined : label}
          data-theme={themeFor(v)}
        >
          {showIcon && <ToolIcon Icon={Icon} fillOnPressed={ghost} />}
          {showLabel && label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
