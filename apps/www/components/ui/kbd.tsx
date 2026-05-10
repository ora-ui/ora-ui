/**
 * Slots: kbd, kbd-group
 */

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const kbdVariants = cva(
  "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs text-ui-label font-medium select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        ghost: 'bg-transparent text-secondary focus-visible:outline-2 focus-visible:outline-focus',
        soft: 'bg-ui text-secondary focus-visible:outline-2 focus-visible:outline-focus',
        surface:
          'bg-ui text-secondary shadow-[0_1px_0_var(--line-subtle)] focus-visible:outline-2 focus-visible:outline-focus',
      },
    },
    defaultVariants: {
      variant: 'soft',
    },
  }
);

function Kbd({
  className,
  variant,
  ...props
}: React.ComponentProps<'kbd'> & VariantProps<typeof kbdVariants>) {
  return <kbd data-slot="kbd" className={cn(kbdVariants({ variant }), className)} {...props} />;
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1 shadow-none', className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
