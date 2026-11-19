'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/registry/ui/context-menu';

export default function ContextMenuHero() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-border text-sm text-secondary select-none">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
