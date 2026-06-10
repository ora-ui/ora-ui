'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { entries } from '@/playground/entries';
import { ScrollArea } from '@/registry/ui/scroll-area';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarItem,
} from '@/registry/ui/sidebar';

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex flex-col w-(--sidebar-width) shrink-0 border-r border-dashed border-separator/50 mr-10">
      <div className="relative flex-1 min-h-0">
        <div className="pointer-events-none absolute inset-x-0 -top-7 h-16 z-10 bg-linear-to-b from-background from-40% to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-7 h-16 z-10 bg-linear-to-t from-background from-40% to-transparent" />
        <ScrollArea className="h-full **:data-[slot=scroll-area-scrollbar]:py-[calc(var(--sidebar-padding-block)+6px)]">
          <SidebarContent className="py-(--sidebar-padding-block)">
            <SidebarGroup>
              <SidebarGroupLabel>Components</SidebarGroupLabel>
              <SidebarGroupContent>
                {entries.map((e) => {
                  const href = `/playground/${e.component}`;
                  return (
                    <SidebarItem key={href} asChild active={pathname === href}>
                      <Link href={href}>{e.name}</Link>
                    </SidebarItem>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>
      </div>
    </nav>
  );
}
