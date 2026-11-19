'use client';

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const collapsibleVariants = cva('text-sm', {
  variants: {
    variant: {
      underline: '',
      soft: '',
    },
  },
  defaultVariants: {
    variant: 'underline',
  },
});

function Collapsible({
  className,
  variant = 'underline',
  ...props
}: CollapsiblePrimitive.Root.Props & VariantProps<typeof collapsibleVariants>) {
  return (
    <CollapsiblePrimitive.Root
      data-slot="collapsible"
      data-variant={variant}
      className={cn(collapsibleVariants({ variant }), className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({
  className,
  children,
  iconPosition = 'end',
  ...props
}: CollapsiblePrimitive.Trigger.Props & { iconPosition?: 'start' | 'end' }) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      data-icon-position={iconPosition}
      className={cn(
        'group relative flex w-full items-center gap-2 px-3 py-2 text-left font-normal focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-ring',
        'data-[icon-position=end]:justify-between data-[icon-position=start]:flex-row-reverse data-[icon-position=start]:justify-end',
        'in-data-[variant=underline]:hover:underline in-data-[variant=underline]:hover:decoration-1 in-data-[variant=underline]:underline-offset-2 in-data-[variant=underline]:decoration-secondary',
        'in-data-[variant=soft]:hover:bg-interactive-subtle in-data-[variant=soft]:aria-expanded:bg-interactive',
        'has-data-[slot=collapsible-trigger-icon]:**:data-[slot=collapsible-trigger-icon-default]:hidden',
        'aria-expanded:[&_[data-slot=collapsible-trigger-icon][data-when=collapsed]]:hidden',
        'not-aria-expanded:[&_[data-slot=collapsible-trigger-icon][data-when=expanded]]:hidden',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="collapsible-trigger-icon-default"
        className="size-4 shrink-0 text-secondary motion-safe:transition-transform motion-safe:duration-200 group-aria-expanded:rotate-180"
      />
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({ className, children, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className="h-(--collapsible-panel-height) overflow-hidden text-secondary motion-safe:transition-[height] motion-safe:ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn('p-3', className)}>{children}</div>
    </CollapsiblePrimitive.Panel>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent, collapsibleVariants };
