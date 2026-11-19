'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/registry/ui/menubar';

function EditMenubar({ variant }: { variant: 'soft' | 'solid' }) {
  return (
    <Menubar variant={variant}>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New file</MenubarItem>
          <MenubarItem>Open...</MenubarItem>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Find</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Zoom in</MenubarItem>
          <MenubarItem>Zoom out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export function MenubarSoft() {
  return <EditMenubar variant="soft" />;
}

export function MenubarSolid() {
  return <EditMenubar variant="solid" />;
}

export default MenubarSoft;
