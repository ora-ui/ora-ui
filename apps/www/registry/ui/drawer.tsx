'use client';

/**
 * CSS custom properties:
 * --backdrop-opacity    Backdrop darkness at rest (default: 0.4)
 *
 * Slots: drawer, drawer-trigger, drawer-portal, drawer-backdrop,
 *        drawer-viewport, drawer-popup, drawer-content,
 *        drawer-title, drawer-description, drawer-close
 */

import * as React from 'react';
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';

import { cn } from '@/registry/lib/utils';

function Drawer({ ...props }: DrawerPrimitive.Root.Props) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: DrawerPrimitive.Portal.Props) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        '[--backdrop-opacity:0.4] fixed inset-0 z-40 bg-black',
        'opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))]',
        'transition-opacity duration-500 ease-out',
        'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[350ms]',
        className
      )}
      {...props}
    />
  );
}

function DrawerViewport({ className, ...props }: DrawerPrimitive.Viewport.Props) {
  return (
    <DrawerPrimitive.Viewport
      data-slot="drawer-viewport"
      className={cn('fixed inset-0 z-50 flex flex-col justify-end', className)}
      {...props}
    />
  );
}

function DrawerPopup({ className, ...props }: DrawerPrimitive.Popup.Props) {
  return (
    <DrawerPrimitive.Popup
      data-slot="drawer-popup"
      className={cn(
        'w-full outline-none',
        '[transform:translateY(var(--drawer-swipe-movement-y))]',
        'transition-transform duration-500 ease-[cubic-bezier(0.45,1.005,0,1.005)]',
        'data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
        'data-[ending-style]:duration-[350ms] data-[ending-style]:ease-in',
        'data-[swiping]:select-none',
        className
      )}
      {...props}
    />
  );
}

function DrawerContent({ className, ...props }: DrawerPrimitive.Content.Props) {
  return (
    <DrawerPrimitive.Content
      data-slot="drawer-content"
      className={cn(
        'rounded-t-xl bg-overlay border border-b-0 border-line-subtle shadow-lg',
        className
      )}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-base font-semibold text-primary', className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-sm text-secondary', className)}
      {...props}
    />
  );
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerBackdrop,
  DrawerViewport,
  DrawerPopup,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
};
