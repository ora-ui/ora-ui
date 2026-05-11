import { source } from '@/docs/lib/source';
import type { ReactNode } from 'react';
import { DocsSidebar } from '@/docs/components/docs-sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ContentLayoutRoot">
      <DocsSidebar tree={source.pageTree} />
      <main className="ContentLayoutMain">{children}</main>
    </div>
  );
}
