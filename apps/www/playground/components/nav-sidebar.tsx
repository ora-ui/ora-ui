'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/registry/lib/utils';
import { entries } from '@/playground/entries';

export function NavSidebar() {
  const pathname = usePathname();
  const items = [
    { href: '/', label: 'Introduction' },
    ...entries.map((e) => ({ href: `/${e.component}`, label: e.name })),
  ];

  return (
    <nav className="w-56 shrink-0 border-r border-line p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
        Components
      </div>
      <ul className="flex flex-col gap-0.5">
        {items.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block w-full rounded-dynamic px-2 py-1 text-left text-sm',
                  active
                    ? 'bg-ui text-foreground'
                    : 'text-foreground-subtle hover:bg-hover/30 hover:text-foreground'
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
