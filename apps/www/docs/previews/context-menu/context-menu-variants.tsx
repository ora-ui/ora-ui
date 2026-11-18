'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/registry/ui/context-menu';

export function ContextMenuSoft() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-line-ui text-sm text-secondary select-none">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent variant="soft">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function ContextMenuSolid() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-line-ui text-sm text-secondary select-none">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent variant="solid">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default ContextMenuSoft;
