'use client';

import Link from 'next/link';
import {
  AnchorProvider,
  ScrollProvider,
  useActiveAnchor,
  type TOCItemType,
} from 'fumadocs-core/toc';
import { cn } from '@/registry/lib/utils';
import { useRef } from 'react';

interface TableOfContentsProps {
  toc: TOCItemType[];
}

function TOCItems({ toc }: { toc: TOCItemType[] }) {
  const activeAnchor = useActiveAnchor();

  return (
    <ul className="flex flex-col gap-1.5">
      {toc.map((item) => (
        <li key={item.url} style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}>
          <Link
            href={item.url}
            className={cn(
              'text-sm text-secondary transition-colors hover:text-primary',
              activeAnchor === item.url.slice(1) && 'font-medium text-primary'
            )}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const viewRef = useRef<HTMLDivElement>(null);
  if (!toc.length) return null;

  return (
    <AnchorProvider toc={toc}>
      <div className="sticky top-(--header-height) flex w-56 shrink-0 flex-col gap-3 py-8 pl-8">
        <p className="text-xs font-medium uppercase tracking-wider text-secondary">On this page</p>
        <div ref={viewRef} className="overflow-auto">
          <ScrollProvider containerRef={viewRef}>
            <TOCItems toc={toc} />
          </ScrollProvider>
        </div>
      </div>
    </AnchorProvider>
  );
}
