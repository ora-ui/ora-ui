import { source } from '@/docs/lib/source';
import type { ReactNode } from 'react';
import { DocsSidebar } from '@/docs/components/docs-sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start px-4 grid-cols-[1fr] sm:px-5 lg:grid-cols-[var(--sidebar-width)_1fr] p-0">
      <DocsSidebar tree={source.pageTree} />
      <div className="min-w-0 w-full pb-(--header-height)">{children}</div>
    </div>
  );
}
