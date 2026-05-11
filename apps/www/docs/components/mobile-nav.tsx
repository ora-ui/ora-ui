'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/16/solid';

import { source } from '@/docs/lib/source';
import { Button } from '@/registry/ui/button';
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerPortal,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
} from '@/registry/ui/drawer';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarItem,
} from '@/registry/ui/sidebar';

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="4" width="14" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="1" y="10" width="14" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const tree = source.pageTree;

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="down">
      <DrawerTrigger
        render={
          <button
            type="button"
            className="flex items-center justify-center rounded-md p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Open navigation menu"
          />
        }
      >
        <MenuIcon />
      </DrawerTrigger>

      <DrawerPortal>
        <DrawerBackdrop />
        <DrawerViewport>
          <DrawerPopup>
            <DrawerContent className="flex flex-col max-h-[90dvh]">
              {/* Header row: drag handle + title + close */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <div className="absolute left-1/2 top-3 h-1 w-10 -translate-x-1/2 rounded-full bg-line" />
                <DrawerTitle>Navigation</DrawerTitle>
                <DrawerClose
                  render={
                    <Button variant="ghost" size="icon-sm" aria-label="Close navigation menu" />
                  }
                >
                  <XMarkIcon />
                </DrawerClose>
              </div>

              {/* Scrollable nav tree */}
              <div className="overflow-y-auto pb-safe pb-6">
                <SidebarContent>
                  {tree.children.map((item) => {
                    if (item.type === 'folder') {
                      return (
                        <SidebarGroup key={item.$id}>
                          <SidebarGroupLabel>{item.name}</SidebarGroupLabel>
                          <SidebarGroupContent>
                            {item.children.map((page) => {
                              if (page.type === 'page') {
                                return (
                                  <SidebarItem
                                    key={page.url}
                                    asChild
                                    active={pathname === page.url}
                                    onClick={() => setOpen(false)}
                                  >
                                    <Link href={page.url}>{page.name}</Link>
                                  </SidebarItem>
                                );
                              }
                              return null;
                            })}
                          </SidebarGroupContent>
                        </SidebarGroup>
                      );
                    }

                    if (item.type === 'page') {
                      return (
                        <SidebarItem
                          key={item.url}
                          asChild
                          active={pathname === item.url}
                          onClick={() => setOpen(false)}
                        >
                          <Link href={item.url}>{item.name}</Link>
                        </SidebarItem>
                      );
                    }

                    return null;
                  })}
                </SidebarContent>
              </div>
            </DrawerContent>
          </DrawerPopup>
        </DrawerViewport>
      </DrawerPortal>
    </Drawer>
  );
}
