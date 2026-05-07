'use client';

import { Kbd, KbdGroup } from '@/components/ui/kbd';

export default function KbdHero() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
    </KbdGroup>
  );
}
