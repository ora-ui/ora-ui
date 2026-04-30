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
} from '@/components/ui/sidebar';

interface DocsSidebarProps {
  tree: typeof source.pageTree;
}

export function DocsSidebar({ tree }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav className="DocsSideNav">
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
                        <SidebarItem key={page.url} asChild active={pathname === page.url}>
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

          // Handle top-level pages
          if (item.type === 'page') {
            return (
              <SidebarItem key={item.url} asChild active={pathname === item.url}>
                <Link href={item.url}>{item.name}</Link>
              </SidebarItem>
            );
          }

          return null;
        })}
      </SidebarContent>
    </nav>
  );
}
