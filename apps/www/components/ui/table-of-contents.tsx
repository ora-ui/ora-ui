'use client';

import Link from 'next/link';
import { AnchorProvider, useActiveAnchor, type TOCItemType } from 'fumadocs-core/toc';
import { cn } from '@/registry/lib/utils';

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
  if (!toc.length) return null;

  return (
    <AnchorProvider toc={toc}>
      <div className="sticky top-0 flex w-56 shrink-0 flex-col gap-3 py-8 pl-8">
        <p className="text-xs font-medium uppercase tracking-wider text-secondary">On this page</p>
        <TOCItems toc={toc} />
      </div>
    </AnchorProvider>
  );
}
