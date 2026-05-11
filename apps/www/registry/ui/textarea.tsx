import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const textareaVariants = cva(
  'w-full min-h-16 rounded-md px-3 py-3 text-base text-primary transition-colors outline-none placeholder:text-muted focus-visible:ring-[3px] focus-visible:ring-focus/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      variant: {
        surface: 'border border-line-ui bg-ui/50 focus-visible:border-focus',
        outline: 'border border-line-ui shadow-2xs focus-visible:border-focus',
        soft: 'bg-ui focus-visible:ring-focus',
      },
      autoResize: {
        true: 'field-sizing-content resize-none',
        false: 'resize-y',
      },
    },
    defaultVariants: {
      variant: 'surface',
      autoResize: true,
    },
  }
);

function Textarea({
  className,
  variant,
  autoResize,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      className={cn(textareaVariants({ variant, autoResize, className }))}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
