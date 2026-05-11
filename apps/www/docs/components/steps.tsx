import * as React from 'react';
import { cn } from '@/registry/lib/utils';

function Steps({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        '[counter-reset:step] mt-3 ml-4 mb-12 border-l border-line pl-8',
        '[&>h3]:relative [&>h3]:mb-4 [&>h3]:mt-0',
        '[&>*:first-child]:mt-0',
        className
      )}
      {...props}
    />
  );
}

function Step({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      className={cn(
        'mt-8 text-lg font-medium tracking-tight text-primary',
        'before:[counter-increment:step] before:absolute before:-left-8.25 before:-translate-x-1/2',
        'before:flex before:size-7 before:items-center before:justify-center',
        'before:rounded-full before:border before:border-line-ui before:bg-surface',
        'before:font-mono before:text-sm before:font-semibold before:text-secondary',
        'before:content-[counter(step)]',
        className
      )}
      {...props}
    />
  );
}

export { Steps, Step };
