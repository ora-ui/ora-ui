'use client';

import { SidebarProvider } from '@/registry/ui/sidebar';
import { PlaygroundSidebar } from '@/playground/components/playground-sidebar';
import { Toaster } from '@/registry/ui/sonner';

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <PlaygroundSidebar />
        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
