'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function CodeBlock({ className, style, children, ...props }: React.ComponentProps<'pre'>) {
  return (
    <div className="relative mt-3 mb-5">
      <pre
        className={cn(
          'overflow-x-auto rounded-md border border-line bg-surface py-4 text-sm',
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
