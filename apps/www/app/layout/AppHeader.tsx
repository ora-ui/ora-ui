'use client';

import * as React from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchDialog } from './SearchDialog';

import { Logo } from '../assets/Logo';
import { cn } from '@/registry/lib/utils';
import { buttonVariants } from '@/registry/ui/button';
import { Kbd } from '@/registry/ui/kbd';
import { Link } from '@/registry/ui/link';
import { Separator } from '@/registry/ui/separator';
import { MobileNav } from '@/app/docs/components/mobile-nav';
import { ModeSwitcher } from './ModeSwitcher';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

interface HeaderActionsProps {
  onSearchOpen: () => void;
  showSearch: boolean;
}

export function HeaderDesktopActions({ onSearchOpen, showSearch }: HeaderActionsProps) {
  return (
    <div className="hidden lg:flex items-center gap-2 pr-6">
      {showSearch && (
        <button
          type="button"
          onClick={onSearchOpen}
          className={cn(buttonVariants({ variant: 'surface', className: 'mr-3' }))}
          aria-label="Search"
        >
          <SearchIcon />
          Search
          <Kbd>⌘K</Kbd>
        </button>
      )}
      <a
        href="https://github.com/ora-ui/ora-ui"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({
            variant: 'ghost',
            size: 'icon',
            className: 'flex items-center justify-center rounded-md',
          })
        )}
        aria-label="GitHub"
      >
        <GitHubIcon />
      </a>
      <Separator orientation="vertical" className="h-4 my-auto" />
      <ModeSwitcher />
    </div>
  );
}

export function HeaderMobileActions({ onSearchOpen, showSearch }: HeaderActionsProps) {
  return (
    <div className="flex lg:hidden items-center gap-1 pr-4">
      {showSearch && (
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex items-center justify-center rounded-md p-2 text-secondary hover:text-primary transition-colors"
          aria-label="Search"
        >
          <SearchIcon />
        </button>
      )}
      <MobileNav />
      <ModeSwitcher />
    </div>
  );
}

export function AppHeader() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const pathname = usePathname();
  const showSearch = pathname.startsWith('/docs');

  React.useEffect(() => {
    if (!showSearch) return;
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  return (
    <header className="absolute left-0 top-0 flex justify-between h-(--header-height) items-center w-full pl-4 lg:pl-7">
      <NextLink href="/">
        <Logo />
      </NextLink>
      <div className="hidden lg:flex items-center gap-8">
        <nav aria-label="Primary navigation" className="flex items-center gap-6 text-sm">
          <Link render={<NextLink href="/docs" />}>Documentation</Link>
          {/* <Link render={<NextLink href="/docs/components" />}>Components</Link> */}
        </nav>
        <HeaderDesktopActions onSearchOpen={() => setSearchOpen(true)} showSearch={showSearch} />
      </div>
      <HeaderMobileActions onSearchOpen={() => setSearchOpen(true)} showSearch={showSearch} />
      {showSearch && <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />}
    </header>
  );
}
