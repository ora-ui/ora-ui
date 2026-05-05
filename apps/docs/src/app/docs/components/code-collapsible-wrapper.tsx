'use client';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Collapsible } from '@base-ui/react/collapsible';
import { cn } from '@/lib/utils';

interface CodeCollapsibleWrapperProps {
  lineCount: number;
  threshold?: number;
  children: React.ReactNode;
  className?: string;
}

export function CodeCollapsibleWrapper({
  lineCount,
  threshold = 15,
  children,
  className,
}: CodeCollapsibleWrapperProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [expandedHeight, setExpandedHeight] = React.useState(0);

  React.useEffect(() => {
    if (contentRef.current) {
      setExpandedHeight(contentRef.current.scrollHeight);
    }
  }, []);

  if (lineCount < threshold) {
    return <>{children}</>;
  }

  function handleOpenChange(next: boolean) {
    if (!next && triggerRef.current) {
      const before = triggerRef.current.getBoundingClientRect().top;
      ReactDOM.flushSync(() => setOpen(false));
      const after = triggerRef.current.getBoundingClientRect().top;
      if (after < 0) window.scrollBy({ top: after - before, behavior: 'instant' });
      return;
    }
    setOpen(next);
  }

  return (
    <Collapsible.Root open={open} onOpenChange={handleOpenChange} className={cn(className)}>
      <div className="relative">
        <div
          ref={contentRef}
          style={{
            maxHeight: open ? `${expandedHeight}px` : 'calc(10lh + 1rem)',
            overflow: 'hidden',
            transition: expandedHeight <= 800 ? 'max-height 0.3s ease-out' : undefined,
          }}
        >
          {children}
        </div>
        {!open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-surface to-transparent" />
        )}
      </div>
      <div ref={triggerRef} className="sticky bottom-0 z-10">
        <Collapsible.Trigger className="w-full h-9 cursor-pointer border-t border-line bg-surface text-sm text-muted transition-colors hover:text-primary">
          {open ? 'Show less' : 'Show more'}
        </Collapsible.Trigger>
      </div>
    </Collapsible.Root>
  );
}
