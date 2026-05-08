'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        soft: 'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-active aria-pressed:text-primary focus-visible:outline-2 focus-visible:outline-focus',
        outline:
          'border border-line-ui/65 bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-active aria-pressed:text-primary focus-visible:outline-2 focus-visible:outline-focus',
        solid:
          'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-fill aria-pressed:text-on-fill focus-visible:outline-2 focus-visible:outline-focus aria-pressed:focus-visible:outline-focus-fill',
      },
      size: {
        sm: 'h-8 min-w-8 px-2.5 has-[>svg:only-child]:p-0',
        md: 'h-9 min-w-9 px-2.5 has-[>svg:only-child]:p-0',
        lg: 'h-10 min-w-10 px-3 has-[>svg:only-child]:p-0',
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
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
