'use client';

import { useState } from 'react';
import { HeartIcon } from '@phosphor-icons/react/dist/ssr';

import { Toggle } from '@/registry/ui/toggle';
import type { EntryState } from '@/playground/lib/types';

export function ToggleRender({ variants, inputs }: EntryState) {
  const label = inputs.label as string;
  const icon = inputs.icon as boolean;
  const iconPosition = (inputs.iconPosition as 'leading' | 'trailing') ?? 'leading';
  const [pressed, setPressed] = useState(false);

  return (
    <Toggle
      variant={variants.variant as 'soft' | 'outline' | 'surface' | 'ghost' | 'solid'}
      theme={variants.theme as 'gray' | 'accent'}
      pressed={pressed}
      onPressedChange={setPressed}
    >
      {icon && iconPosition === 'leading' && <HeartIcon weight={pressed ? 'fill' : 'regular'} />}
      {label && (pressed ? 'Liked' : label)}
      {icon && iconPosition === 'trailing' && <HeartIcon weight={pressed ? 'fill' : 'regular'} />}
    </Toggle>
  );
}
