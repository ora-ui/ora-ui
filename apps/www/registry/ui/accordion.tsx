'use client';

import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const accordionVariants = cva('flex flex-col justify-center text-sm overflow-hidden', {
  variants: {
    bordered: {
      true: 'outline outline-line-ui rounded-md',
      false: '',
    },
  },
  defaultVariants: {
    bordered: false,
  },
});

const accordionItemVariants = cva(
  'group/accordion-item border-b border-line-ui in-data-bordered:last:border-b-0',
  {
    variants: {
      variant: {
        underline: '',
        soft: '',
      },
    },
    defaultVariants: {
      variant: 'underline',
    },
  }
);

function Accordion({
  className,
  bordered = false,
  ...props
}: AccordionPrimitive.Root.Props & VariantProps<typeof accordionVariants>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-bordered={bordered ? '' : undefined}
      className={cn(accordionVariants({ bordered }), className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  variant = 'underline',
  ...props
}: AccordionPrimitive.Item.Props & VariantProps<typeof accordionItemVariants>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      data-variant={variant}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    />
  );
}

function AccordionTrigger({ className, children, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'group relative flex w-full items-baseline justify-between gap-4 py-2 pr-1 pl-3 text-left font-normal focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-focus',
          'in-data-[variant=underline]:hover:underline in-data-[variant=underline]:hover:decoration-1 in-data-[variant=underline]:underline-offset-2 in-data-[variant=underline]:decoration-secondary',
          'in-data-[variant=soft]:hover:bg-hover/50 in-data-[variant=soft]:aria-expanded:bg-hover/75',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          className="size-4 shrink-0 text-muted transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-secondary transition-[height] ease-out data-ending-style:h-0 data-starting-style:h-0"
      {...props}
    >
      <div className={cn('p-3', className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent, accordionVariants };
