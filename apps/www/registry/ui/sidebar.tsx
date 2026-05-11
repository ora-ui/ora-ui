'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/registry/lib/utils';

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
      className={cn('flex flex-1 flex-col gap-1 overflow-y-auto px-7 py-5', className)}
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

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SidebarGroup({ children, className, ...props }: SidebarGroupProps) {
  return (
    <div data-slot="sidebar-group" className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

/* ---------- SidebarGroupLabel ---------- */

function SidebarGroupLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn('py-1.5 text-sm  text-muted', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ---------- SidebarGroupContent ---------- */

function SidebarGroupContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn('flex flex-col gap-0.5 py-1', className)}
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
        'flex items-center gap-2 rounded-md px-2 py-1.5 pl-4 text-sm text-primary not-data-active:hover:bg-hover/60',
        active && 'bg-active/60',
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
