import { NavSidebar } from '@/playground/components/nav-sidebar';

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full overflow-hidden overscroll-none sm:px-5 lg:px-0">
      <NavSidebar />
      {children}
    </div>
  );
}
