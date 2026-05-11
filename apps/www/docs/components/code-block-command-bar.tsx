'use client';

import * as React from 'react';
import { CopySimpleIcon, CheckIcon } from '@phosphor-icons/react';
import { Button } from '@/registry/ui/button';
import { cn } from '@/registry/lib/utils';
import { useCodeCollapsible } from './code-collapsible-wrapper';

export function CodeBlockCommandBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-1 border-b border-line bg-surface p-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CodeBlockExpandButton() {
  const ctx = useCodeCollapsible();
  if (!ctx) return null;
  const { open, onOpenChange } = ctx;
  return (
    <Button variant="ghost" onClick={() => onOpenChange(!open)}>
      {open ? 'Collapse' : 'Expand'}
    </Button>
  );
}

export function CodeBlockCopyButton({ code, floating }: { code: string; floating?: boolean }) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement('textarea');
      area.value = code;
      area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (floating) {
    return (
      <Button
        aria-label="Copy code"
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2 text-muted hover:text-primary"
        onClick={handleCopy}
      >
        {copied ? <CheckIcon /> : <CopySimpleIcon />}
      </Button>
    );
  }

  return (
    <Button variant="ghost" onClick={handleCopy}>
      Copy
      {copied ? <CheckIcon /> : <CopySimpleIcon />}
    </Button>
  );
}
