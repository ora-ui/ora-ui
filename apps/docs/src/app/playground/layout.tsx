'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { PlaygroundSidebar } from './components/playground-sidebar';
import { Toaster } from '@/components/ui/sonner';

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
