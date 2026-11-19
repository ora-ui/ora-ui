'use client';

import * as React from 'react';
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

import { cn } from '@/registry/lib/utils';
import { buttonVariants } from '@/registry/ui/button';

function NavigationMenu({
  className,
  orientation = 'horizontal',
  ...props
}: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/navigation-menu relative flex w-max', className)}
      {...props}
    />
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuPrimitive.List.Props) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        'flex list-none items-center gap-1 group-data-[orientation=vertical]/navigation-menu:flex-col group-data-[orientation=vertical]/navigation-menu:items-stretch',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({ ...props }: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />;
}

function NavigationMenuIcon({ className, children, ...props }: NavigationMenuPrimitive.Icon.Props) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-icon"
      className={cn(
        'flex shrink-0 text-secondary motion-safe:transition-transform motion-safe:duration-200 group-data-popup-open/navigation-menu-trigger:rotate-180',
        className
      )}
      {...props}
    >
      {children ?? <ChevronDownIcon className="size-4" />}
    </NavigationMenuPrimitive.Icon>
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  const hasCustomIcon = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === NavigationMenuIcon
  );

  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        'group/navigation-menu-trigger',
        buttonVariants({ variant: 'ghost' }),
        'data-popup-open:bg-interactive',
        className
      )}
      {...props}
    >
      {children}
      {!hasCustomIcon && <NavigationMenuIcon />}
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'max-h-(--available-height) w-max max-w-(--available-width) overflow-y-auto p-2',
        'motion-safe:transition-[opacity,translate] motion-safe:duration-200 motion-safe:ease-out',
        'data-ending-style:opacity-0 data-starting-style:opacity-0',
        'data-[starting-style]:data-[activation-direction=left]:-translate-x-1/2 data-[starting-style]:data-[activation-direction=right]:translate-x-1/2',
        'data-[ending-style]:data-[activation-direction=left]:translate-x-1/2 data-[ending-style]:data-[activation-direction=right]:-translate-x-1/2',
        'data-[starting-style]:data-[activation-direction=up]:-translate-y-1/2 data-[starting-style]:data-[activation-direction=down]:translate-y-1/2',
        'data-[ending-style]:data-[activation-direction=up]:translate-y-1/2 data-[ending-style]:data-[activation-direction=down]:-translate-y-1/2',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'flex flex-col gap-0.5 rounded-sm px-3 py-1.5 text-sm text-primary outline-hidden hover:bg-interactive focus-visible:outline-2 focus-visible:outline-ring data-active:bg-interactive-subtle data-active:font-medium',
        'in-data-[slot=navigation-menu-list]:h-7.5 in-data-[slot=navigation-menu-list]:justify-center in-data-[slot=navigation-menu-list]:rounded-dynamic in-data-[slot=navigation-menu-list]:py-0 in-data-[slot=navigation-menu-list]:text-ui-label in-data-[slot=navigation-menu-list]:font-medium',
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Popup.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'>) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) outline-none motion-safe:transition-[top,left,right,bottom] motion-safe:duration-300 motion-safe:ease-out data-instant:transition-none"
      >
        <NavigationMenuPrimitive.Popup
          data-slot="navigation-menu-viewport"
          className={cn(
            'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-md bg-overlay text-sm text-primary shadow-md ring-1 ring-line outline-none',
            'motion-safe:transition-[opacity,scale,width,height] motion-safe:duration-300 motion-safe:ease-out',
            'data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className
          )}
          {...props}
        >
          <NavigationMenuPrimitive.Viewport
            data-slot="navigation-menu-viewport-inner"
            className="relative size-full overflow-hidden rounded-[inherit]"
          />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIcon,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
};
