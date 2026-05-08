/**
 * Slots: radio-group, radio-group-item, radio-group-indicator
 */

'use client';

import * as React from 'react';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const radioVariants = cva(
  'group/radio relative flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
  {
    variants: {
      variant: {
        solid: 'border-line-ui bg-transparent data-checked:border-none data-checked:bg-fill',
        surface: 'border-line-ui bg-ui data-checked:border-none data-checked:bg-active',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  }
);

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  variant = 'solid',
  ...props
}: RadioPrimitive.Root.Props & VariantProps<typeof radioVariants>) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      data-variant={variant}
      className={cn(
        radioVariants({ variant }),
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'aria-invalid:border-[var(--destructive-line-ui)] aria-invalid:data-checked:bg-[var(--destructive-fill)]',
        variant === 'solid' && 'data-checked:focus-visible:outline-focus-fill',
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center text-current"
      >
        <span className="size-2 rounded-full bg-on-fill" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem, radioVariants };
