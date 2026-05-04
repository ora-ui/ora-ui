'use client';

import * as React from 'react';
import { CopySimpleIcon, CheckIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export function CodeBlock({ className, style, children, ...props }: React.ComponentProps<'pre'>) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    const text = ref.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
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
    <div className="group relative mt-3 mb-5">
      <pre
        ref={ref}
        className={cn(
          'overflow-x-auto rounded-md border border-line bg-surface py-4 text-sm',
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className={cn(
          'absolute top-3 right-3 flex size-7 cursor-pointer items-center justify-center rounded-sm',
          'text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100',
          'hover:bg-hover hover:text-primary focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1',
          copied && 'opacity-100 text-primary'
        )}
      >
        {copied ? <CheckIcon className="size-4" /> : <CopySimpleIcon className="size-4" />}
      </button>
    </div>
  );
}
