'use client';

import * as React from 'react';
import { cn } from '@/registry/lib/utils';

export function CodeBlockRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('relative mt-3 mb-5 overflow-hidden rounded-md border border-line', className)}
    >
      {children}
    </div>
  );
}

export function CodeBlock({ className, style, children, ...props }: React.ComponentProps<'pre'>) {
  return (
    <pre
      className={cn('overflow-x-auto bg-surface py-4 text-sm', className)}
      style={style}
      {...props}
    >
      {children}
    </pre>
  );
}
