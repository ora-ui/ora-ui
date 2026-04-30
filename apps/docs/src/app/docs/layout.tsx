import { source } from '@/lib/source';
import type { ReactNode } from 'react';
import { DocsSidebar } from '@/app/docs/components/docs-sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ContentLayoutRoot">
      <DocsSidebar tree={source.pageTree} />
      <main className="ContentLayoutMain">{children}</main>
    </div>
  );
}
