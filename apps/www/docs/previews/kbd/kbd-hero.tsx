'use client';

import { Kbd, KbdGroup } from '@/registry/ui/kbd';

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
