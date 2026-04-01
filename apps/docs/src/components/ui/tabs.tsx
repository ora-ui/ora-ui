'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

type TabsVariant = 'line' | 'soft';

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        'flex flex-col gap-2 data-[orientation=vertical]:flex-row data-[orientation=vertical]:items-start',
        className
      )}
      {...props}
    />
  );
}

function TabsSurface({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="tabs-surface"
      className={cn('w-fit rounded-md bg-hover/50 p-1 dark:bg-surface-2', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  variant = 'line',
  track = true,
  transition = false,
  children,
  ...props
}: TabsPrimitive.List.Props & {
  variant?: TabsVariant;
  track?: boolean;
  transition?: boolean;
}) {
  const isSoft = variant === 'soft';

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'relative flex w-fit items-center',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start',
        variant === 'line' && [
          'gap-1',
          track && 'data-[orientation=horizontal]:shadow-[inset_0_-1px_0_var(--line)]',
          track && 'data-[orientation=vertical]:shadow-[inset_-1px_0_0_var(--line)]',
        ],
        isSoft && 'gap-0.5',
        className
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className={cn(
          'pointer-events-none absolute',
          transition &&
            'motion-safe:transition-[translate,width,height] motion-safe:duration-200 motion-safe:ease-in-out',
          isSoft && [
            // Anchor to bottom-left; translate to exact tab position for both orientations
            'bottom-0 left-0 z-0 rounded-sm',
            'h-(--active-tab-height) w-(--active-tab-width)',
            'translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom)',
            'bg-hover',
          ],
          variant === 'line' && [
            'z-10 bg-foreground',
            // Horizontal: 2px line at the active tab's bottom edge
            'data-[orientation=horizontal]:bottom-0',
            'data-[orientation=horizontal]:left-0',
            'data-[orientation=horizontal]:h-0.5',
            'data-[orientation=horizontal]:w-(--active-tab-width)',
            'data-[orientation=horizontal]:translate-x-(--active-tab-left)',
            'data-[orientation=horizontal]:-translate-y-(--active-tab-bottom)',
            // Vertical: 2px line at the active tab's right edge
            'data-[orientation=vertical]:top-0',
            'data-[orientation=vertical]:right-0',
            'data-[orientation=vertical]:w-0.5',
            'data-[orientation=vertical]:h-(--active-tab-height)',
            'data-[orientation=vertical]:translate-y-(--active-tab-top)',
          ]
        )}
      />
    </TabsPrimitive.List>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      className={cn(
        'relative z-10 inline-flex cursor-default select-none items-center justify-center rounded-sm',
        'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
        'whitespace-nowrap px-3 py-1.5 text-sm font-medium in-data-[variant=line]:pb-2.5',
        'text-foreground-subtle transition-colors',
        'hover:text-foreground data-active:text-foreground',
        'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-panel"
      className={cn('text-sm outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsSurface, TabsList, TabsTab, TabsPanel };
export type { TabsVariant };
