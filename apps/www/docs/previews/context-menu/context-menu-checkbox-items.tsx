'use client';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/registry/ui/context-menu';

export default function ContextMenuCheckboxItems() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-line-ui text-sm text-secondary select-none">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuCheckboxItem defaultChecked>Show hidden files</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show extensions</ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
