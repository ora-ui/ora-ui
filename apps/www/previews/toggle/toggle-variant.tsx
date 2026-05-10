'use client';

import { BoldIcon } from '@heroicons/react/16/solid';

import { Toggle } from '@/components/ui/toggle';

export function Soft() {
  return (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export function Outline() {
  return (
    <Toggle variant="outline" aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export function Solid() {
  return (
    <Toggle variant="solid" aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  );
}

export default Soft;
