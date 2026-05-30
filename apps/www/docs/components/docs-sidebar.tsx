'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { source } from '@/docs/lib/source';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarItem,
} from '@/registry/ui/sidebar';
import { ScrollArea } from '@/registry/ui/scroll-area';

interface DocsSidebarProps {
  tree: typeof source.pageTree;
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const pathname = usePathname();

  const topLevelPages = tree.children.filter((item) => item.type === 'page');
  const folders = tree.children.filter((item) => item.type === 'folder');

  return (
    <nav className="hidden lg:flex flex-col sticky top-(--header-height) h-[calc(100dvh-var(--header-height))] mr-10">
      <div className="pointer-events-none absolute inset-x-0 -top-7 h-16 z-10 bg-linear-to-b from-background from-40% to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-7 h-16 z-10 bg-linear-to-t from-background from-40% to-transparent" />
      <ScrollArea className="flex-1 **:data-[slot=scroll-area-scrollbar]:py-[calc(var(--sidebar-padding-block)+6px)]">
        <SidebarContent className="py-(--sidebar-padding-block)">
          {topLevelPages.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
              <SidebarGroupContent>
                {topLevelPages.map((item) => {
                  if (item.type !== 'page') return null;
                  return (
                    <SidebarItem key={item.url} asChild active={pathname === item.url}>
                      <Link href={item.url}>{item.name}</Link>
                    </SidebarItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {folders.map((item) => {
            if (item.type !== 'folder') return null;
            return (
              <SidebarGroup key={item.$id}>
                <SidebarGroupLabel>{item.name}</SidebarGroupLabel>
                <SidebarGroupContent>
                  {item.children.map((page) => {
                    if (page.type !== 'page') return null;
                    return (
                      <SidebarItem key={page.url} asChild active={pathname === page.url}>
                        <Link href={page.url}>{page.name}</Link>
                      </SidebarItem>
                    );
                  })}
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      </ScrollArea>
    </nav>
  );
}
