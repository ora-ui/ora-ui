'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/registry/ui/context-menu';

export default function ContextMenuSubmenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-line-ui text-sm text-secondary select-none">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>Copy link</ContextMenuItem>
            <ContextMenuItem>Messages</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
