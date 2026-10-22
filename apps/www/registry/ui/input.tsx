/**
 * Slots: input
 */

import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const inputVariants = cva(
  [
    'h-7.5 w-full min-w-32 rounded-dynamic px-3 text-sm text-primary',
    'placeholder:text-secondary',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'file:inline-flex file:h-7 file:border-0 file:mr-2 file:bg-transparent file:text-sm file:font-medium file:text-primary',
    'focus-visible:outline-3 focus-visible:outline-ring/50 focus-visible:outline-offset-0',
    'aria-invalid:border-destructive-700 aria-invalid:focus-visible:outline-destructive-700',
  ],
  {
    variants: {
      variant: {
        surface: 'bg-ui-subtle border border-border',
        outline: 'border border-border shadow-2xs',
        soft: 'bg-ui border border-transparent',
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
