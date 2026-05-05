'use client';

import * as React from 'react';
import { CopySimpleIcon, CheckIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
        'flex items-center justify-end gap-1 border-b border-line bg-surface px-2 py-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CodeBlockExpandButton() {
  const { open, onOpenChange } = useCodeCollapsible();
  return (
    <Button variant="ghost" onClick={() => onOpenChange(!open)}>
      {open ? 'Collapse' : 'Expand'}
    </Button>
  );
}

export function CodeBlockCopyButton({ code }: { code: string }) {
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

  return (
    <Button variant="ghost" onClick={handleCopy}>
      Copy
      {copied ? <CheckIcon /> : <CopySimpleIcon />}
    </Button>
  );
}
