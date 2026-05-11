'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { source } from '@/lib/source';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarItem,
} from '@/registry/ui/sidebar';

interface DocsSidebarProps {
  tree: typeof source.pageTree;
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const pathname = usePathname();

  const topLevelPages = tree.children.filter((item) => item.type === 'page');
  const folders = tree.children.filter((item) => item.type === 'folder');

  return (
    <nav className="hidden lg:flex flex-col sticky top-0 max-h-dvh overflow-y-auto mr-10">
      <SidebarContent>
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
    </nav>
  );
}
