'use client';

import { Kbd, KbdGroup } from '@/registry/ui/kbd';

export default function KbdCombination() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  );
}
