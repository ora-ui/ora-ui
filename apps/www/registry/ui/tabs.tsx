'use client';

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import * as React from 'react';

import { cn } from '@/registry/lib/utils';

type TabsVariant = 'soft' | 'solid';

const TabsContext = React.createContext<{ variant: TabsVariant }>({ variant: 'soft' });

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
  variant = 'soft',
  track: _track = true,
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
    <TabsContext.Provider value={{ variant }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(
          'relative flex w-fit items-center',
          'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start',
          isSoft && 'gap-0.5',
          className
        )}
        {...props}
      >
        {children}
        <TabsPrimitive.Indicator
          data-slot="tabs-indicator"
          data-variant={variant}
          className={cn(
            'pointer-events-none absolute',
            transition &&
              'motion-safe:transition-[translate,width,height] motion-safe:duration-200 motion-safe:ease-in-out',
            [
              // Anchor to bottom-left; translate to exact tab position for both orientations
              'bottom-0 left-0 z-0 rounded-sm',
              'h-(--active-tab-height) w-(--active-tab-width)',
              'translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom)',
              isSoft ? 'bg-active' : 'bg-fill',
            ]
          )}
        />
      </TabsPrimitive.List>
    </TabsContext.Provider>
  );
}

function TabsTab({ className, ...props }: TabsPrimitive.Tab.Props) {
  const { variant } = React.useContext(TabsContext);
  const isSoft = variant === 'soft';
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-tab"
      data-variant={variant}
      className={cn(
        'relative z-10 inline-flex cursor-default select-none items-center justify-center rounded-sm',
        'data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start',
        'whitespace-nowrap px-2 py-1 text-sm font-medium',
        'text-secondary hover:not-data-active:text-primary data-active:transition-colors',
        isSoft ? 'data-active:text-primary' : 'data-active:text-on-fill',
        'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2',
        'data-disabled:pointer-events-none data-disabled:text-disabled',
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
