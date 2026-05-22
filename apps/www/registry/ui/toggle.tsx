'use client';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const toggleVariants = cva(
  [
    'group/toggle inline-flex items-center justify-center gap-1 rounded-dynamic text-sm font-medium text-ui-label whitespace-nowrap select-none bg-clip-padding transition-colors outline-none disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'focus-visible:outline-2 focus-visible:outline-focus',
    'aria-invalid:border-(--destructive-ring) aria-invalid:focus-visible:outline-(--destructive-ring)',
  ],
  {
    variants: {
      variant: {
        soft: 'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-active aria-pressed:text-primary',
        outline:
          'border border-line-ui bg-transparent text-secondary hover:bg-hover/30 hover:text-primary aria-pressed:bg-active/65 aria-pressed:text-primary',
        surface:
          'border border-line-ui bg-ui text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-active aria-pressed:text-primary',
        ghost:
          'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-hover aria-pressed:text-primary',
        solid:
          'bg-transparent text-secondary hover:bg-hover hover:text-primary aria-pressed:bg-fill aria-pressed:text-on-fill aria-pressed:focus-visible:outline-focus-fill aria-pressed:focus-visible:outline-offset-2',
      },
      size: {
        sm: "h-7 gap-1.5 px-2 [&_svg:not([class*='size-'])]:size-3",
        md: 'h-7.5 px-3',
        lg: 'h-9 px-4.5',
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
