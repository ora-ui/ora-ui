/**
 * Slots: input
 */

import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const inputVariants = cva(
  [
    'h-8 w-full min-w-0 rounded-dynamic px-3 py-1 text-sm text-primary outline-none transition-colors',
    'placeholder:text-muted',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary',
    'focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-0',
    'aria-invalid:border-(--destructive-fill) aria-invalid:focus-visible:outline-(--destructive-fill)',
  ],
  {
    variants: {
      variant: {
        surface: 'bg-ui border border-line-ui focus-visible:border-focus-fill',
        outline: 'border border-line-ui shadow-2xs focus-visible:border-focus-fill',
        soft: 'bg-ui border border-transparent focus-visible:border-focus-fill',
      },
    },
    defaultVariants: {
      variant: 'surface',
    },
  }
);

function Input({
  className,
  type,
  variant = 'surface',
  ...props
}: InputPrimitive.Props & VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-variant={variant}
      className={cn(inputVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
