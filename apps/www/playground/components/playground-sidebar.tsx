'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/registry/ui/sidebar';
import { Input } from '@/registry/ui/input';
import { registry } from '@/playground/entries';
import { GlobalControls } from './global-controls';
import { cn } from '@/registry/lib/utils';

export function PlaygroundSidebar() {
  const pathname = usePathname();
  const [filter, setFilter] = React.useState('');

  const filteredRegistry = React.useMemo(() => {
    if (!filter) return registry;

    const filtered: typeof registry = {};
    for (const [group, entries] of Object.entries(registry)) {
      const matchingEntries = entries.filter((entry) =>
        entry.name.toLowerCase().includes(filter.toLowerCase())
      );
      if (matchingEntries.length > 0) {
        filtered[group] = matchingEntries;
      }
    }
    return filtered;
  }, [filter]);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/playground"
          className="text-sm font-semibold text-foreground hover:text-foreground-subtle transition-colors"
        >
          Playground
        </Link>
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-foreground-subtle" />
          <Input
            variant="soft"
            placeholder="Filter..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(filteredRegistry).map(([group, entries]) => {
          if (entries.length === 0) return null;

          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel>{capitalize(group)}</SidebarGroupLabel>
              <SidebarGroupContent>
                {entries.map((entry) => {
                  const href = `/playground/${entry.slug}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={entry.slug}
                      href={href}
                      data-slot="sidebar-item"
                      data-active={isActive || undefined}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-2 py-1.5 pl-7 text-sm text-foreground-subtle hover:bg-hover hover:text-foreground transition-colors',
                        isActive && 'bg-hover text-foreground font-medium'
                      )}
                    >
                      {entry.name}
                    </Link>
                  );
                })}
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter>
        <GlobalControls />
      </SidebarFooter>
    </Sidebar>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
