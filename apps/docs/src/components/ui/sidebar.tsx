'use client';

import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { Slot } from '@radix-ui/react-slot';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

import { cn } from '@/lib/utils';

/* ---------- Context ---------- */

interface SidebarContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

/* ---------- Provider ---------- */

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

function SidebarProvider({ children, defaultCollapsed = false }: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

/* ---------- Sidebar ---------- */

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

function Sidebar({ className, children, ...props }: SidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <aside
      data-slot="sidebar"
      data-collapsed={collapsed}
      className={cn(
        'flex h-full w-64 shrink-0 flex-col border-r border-line-subtle bg-background',
        collapsed && 'w-0 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

/* ---------- SidebarHeader ---------- */

function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn('flex shrink-0 flex-col gap-2 px-3 py-4', className)}
      {...props}
    />
  );
}

/* ---------- SidebarContent ---------- */

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2', className)}
      {...props}
    />
  );
}

/* ---------- SidebarFooter ---------- */

function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        'flex shrink-0 flex-col gap-2 border-t border-line-subtle px-3 py-4',
        className
      )}
      {...props}
    />
  );
}

/* ---------- SidebarGroup ---------- */

interface SidebarGroupContextValue {
  open: boolean;
}

const SidebarGroupContext = React.createContext<SidebarGroupContextValue>({ open: true });

interface SidebarGroupProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function SidebarGroup({ children, defaultOpen = true, className }: SidebarGroupProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <SidebarGroupContext.Provider value={{ open }}>
      <CollapsiblePrimitive.Root
        data-slot="sidebar-group"
        open={open}
        onOpenChange={setOpen}
        className={cn('flex flex-col', className)}
      >
        {children}
      </CollapsiblePrimitive.Root>
    </SidebarGroupContext.Provider>
  );
}

/* ---------- SidebarGroupLabel ---------- */

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function SidebarGroupLabel({ className, children, ...props }: SidebarGroupLabelProps) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="sidebar-group-label"
      className={cn(
        'group/sidebar-group-label flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-secondary hover:bg-hover transition-colors',
        className
      )}
      {...props}
    >
      <ChevronRightIcon className="size-3.5 shrink-0 transition-transform duration-200 group-data-[open]/sidebar-group-label:rotate-90" />
      <span>{children}</span>
    </CollapsiblePrimitive.Trigger>
  );
}

/* ---------- SidebarGroupContent ---------- */

function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="sidebar-group-content"
      className={cn('flex flex-col gap-0.5 overflow-hidden py-1', className)}
      {...props}
    />
  );
}

/* ---------- SidebarItem ---------- */

interface SidebarItemProps extends React.ComponentPropsWithoutRef<'a'> {
  asChild?: boolean;
  active?: boolean;
}

function SidebarItem({ className, asChild = false, active, ...props }: SidebarItemProps) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-slot="sidebar-item"
      data-active={active}
      className={cn(
        'flex items-center gap-2 rounded-md px-2 py-1.5 pl-7 text-sm text-secondary hover:bg-hover hover:text-primary transition-colors',
        active && 'bg-hover text-primary font-medium',
        className
      )}
      {...props}
    />
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarItem,
  useSidebar,
};
