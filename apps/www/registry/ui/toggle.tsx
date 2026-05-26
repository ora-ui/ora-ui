'use client';

import * as React from 'react';
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

type Theme = 'gray' | 'accent' | (string & {});

const toggleVariants = cva(
  [
    'group/toggle inline-flex items-center justify-center gap-1 rounded-dynamic text-sm font-medium text-ui-label whitespace-nowrap select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'focus-visible:outline-2 focus-visible:outline-focus',
    'aria-invalid:border-(--destructive-ring) aria-invalid:focus-visible:outline-(--destructive-ring)',
  ],
  {
    variants: {
      variant: {
        soft: 'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-active/50 aria-pressed:text-primary data-[theme=accent]:aria-pressed:text-secondary',
        outline:
          'border border-ring/50 bg-transparent text-secondary hover:text-primary aria-pressed:bg-transparent aria-pressed:border-ring aria-pressed:text-primary data-[theme=accent]:aria-pressed:text-secondary',
        surface:
          'border border-ring/50 bg-ui/50 text-secondary hover:border-ring hover:bg-hover/50 hover:text-primary aria-pressed:bg-active/50 data-[theme=accent]:aria-pressed:bg-active/40 aria-pressed:border-ring aria-pressed:text-primary data-[theme=accent]:aria-pressed:text-secondary',
        ghost:
          'bg-transparent text-secondary hover:text-primary aria-pressed:bg-transparent aria-pressed:text-primary data-[theme=accent]:aria-pressed:text-secondary',
        solid:
          'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-fill aria-pressed:text-on-fill aria-pressed:focus-visible:outline-focus-fill aria-pressed:focus-visible:outline-offset-2',
      },
      size: {
        sm: "h-7 min-w-7 gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3",
        md: 'h-7.5 min-w-7.5 px-2.5',
        lg: 'h-8.75 min-w-9 px-3.75',
      },
    },
    defaultVariants: {
      variant: 'soft',
      size: 'md',
    },
  }
);

function Toggle({
  className,
  variant = 'soft',
  size = 'md',
  theme = 'gray',
  pressed,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    theme?: Theme;
  }) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-theme={theme !== 'gray' && pressed ? theme : undefined}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
