import * as React from 'react';

import { cn } from '@/registry/lib/utils';

function VisuallyHidden({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="visually-hidden"
      className={cn(
        'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]',
        className
      )}
      {...props}
    />
  );
}

export { VisuallyHidden };
