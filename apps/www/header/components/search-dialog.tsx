'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useRouter } from 'next/navigation';
import type { SortedResult } from 'fumadocs-core/search';

import { cn } from '@/registry/lib/utils';

function SearchInputIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-muted"
    >
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="animate-spin shrink-0 text-muted"
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-muted mt-px"
    >
      <rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 4.5H9.5M3.5 6.5H7.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeadingIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-muted mt-px"
    >
      <path
        d="M2 3V10M2 6.5H7.5M7.5 3V10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ResultItemProps {
  result: SortedResult;
  active: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

function ResultItem({ result, active, onMouseEnter, onClick }: ResultItemProps) {
  const isPage = result.type === 'page';

  return (
    <li>
      <a
        href={result.url}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        onMouseEnter={onMouseEnter}
        className={cn(
          'flex items-start gap-2.5 px-3 py-2.5 mx-2 rounded-md text-sm cursor-pointer transition-colors no-underline',
          isPage ? 'font-medium text-primary' : 'text-secondary',
          active ? 'bg-hover text-primary' : 'hover:bg-hover'
        )}
      >
        <span className="mt-0.5">{isPage ? <PageIcon /> : <HeadingIcon />}</span>
        <div className="flex flex-col gap-0.5 min-w-0">
          {result.breadcrumbs && result.breadcrumbs.length > 0 && !isPage && (
            <span className="text-xs text-muted truncate">{result.breadcrumbs.join(' › ')}</span>
          )}
          <span
            className="leading-snug [&_mark]:bg-transparent [&_mark]:text-primary [&_mark]:font-semibold"
            dangerouslySetInnerHTML={{ __html: result.content }}
          />
        </div>
      </a>
    </li>
  );
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { search, setSearch, query } = useDocsSearch({ type: 'fetch' });
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = !query.data || query.data === 'empty' ? [] : query.data;

  React.useEffect(() => {
    if (!open) {
      setSearch('');
      setActiveIndex(0);
    }
  }, [open, setSearch]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      router.push(results[activeIndex].url);
      onOpenChange(false);
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup
          className="fixed left-1/2 top-[10vh] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-line-subtle bg-overlay shadow-xl outline-none transition-[opacity,transform] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
          onAnimationEnd={() => {
            if (open) inputRef.current?.focus();
          }}
        >
          {/* Input row */}
          <div className="flex items-center gap-3 border-b border-line-subtle px-3.5">
            <SearchInputIcon />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search docs..."
              className="flex-1 bg-transparent py-3.5 text-sm text-primary placeholder:text-muted outline-none"
              autoComplete="off"
              spellCheck={false}
            />
            {query.isLoading && <SpinnerIcon />}
          </div>

          {/* Results / empty states */}
          <div className="max-h-80 overflow-y-auto py-2">
            {results.length > 0 ? (
              <ul className="m-0 list-none p-0">
                {results.map((result, i) => (
                  <ResultItem
                    key={result.id}
                    result={result}
                    active={i === activeIndex}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      router.push(result.url);
                      onOpenChange(false);
                    }}
                  />
                ))}
              </ul>
            ) : search && !query.isLoading ? (
              <p className="px-4 py-8 text-center text-sm text-secondary">
                No results for &ldquo;{search}&rdquo;
              </p>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-muted">
                Type to search documentation&hellip;
              </p>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-3 border-t border-line-subtle px-4 py-2.5">
            <span className="text-xs text-muted">
              <kbd className="font-sans">↑↓</kbd> navigate
            </span>
            <span className="text-xs text-muted">
              <kbd className="font-sans">↵</kbd> open
            </span>
            <span className="text-xs text-muted">
              <kbd className="font-sans">esc</kbd> close
            </span>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
