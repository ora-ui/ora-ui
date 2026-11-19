'use client';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from '@/registry/ui/menubar';

export default function MenubarCheckboxItems() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Interface</MenubarLabel>
            <MenubarCheckboxItem defaultChecked>Show toolbar</MenubarCheckboxItem>
            <MenubarCheckboxItem>Show sidebar</MenubarCheckboxItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
