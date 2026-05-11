'use client';

import { BoldIcon } from '@heroicons/react/16/solid';

import { Toggle } from '@/registry/ui/toggle';

export function ToggleSoft() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export function ToggleOutline() {
  return (
    <Toggle variant="outline" aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export function ToggleSolid() {
  return (
    <Toggle variant="solid" aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export default ToggleSoft;
