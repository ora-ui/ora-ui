'use client';

import { BoldIcon } from '@heroicons/react/16/solid';

import { Toggle } from '@/registry/ui/toggle';

export default function ToggleHero() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}
