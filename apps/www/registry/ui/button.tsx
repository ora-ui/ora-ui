'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-dynamic text-sm text-ui-label font-medium select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-ring aria-expanded:data-[icon=inline-start]:pl-7! data-[slot=select-trigger]:font-normal",
  {
    variants: {
      variant: {
        solid:
          'bg-solid text-on-solid hover:bg-solid-interactive active:bg-solid-interactive aria-expanded:bg-solid-interactive focus-visible:outline-ring focus-visible:outline-offset-2',
        outline:
          'border border-border bg-transparent hover:bg-ui-subtle active:bg-interactive-subtle aria-expanded:bg-ui-subtle',
        surface:
          'border border-border bg-ui-subtle hover:border-border-strong active:bg-interactive-subtle aria-expanded:border-border-strong',
        soft: 'bg-ui hover:bg-interactive active:bg-interactive-strong aria-expanded:bg-interactive',
        ghost: 'hover:bg-interactive-subtle active:bg-interactive aria-expanded:bg-interactive',
      },
      size: {
        sm: "h-7 gap-1.5 px-2 has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        md: 'h-7.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-9 px-4.5 has-[>svg]:px-4',
        icon: 'size-7.5',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);

type Theme = 'gray' | 'accent' | 'destructive' | (string & {});

interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  theme?: Theme;
}

function Button({
  className,
  variant = 'solid',
  theme = 'gray',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-theme={theme !== 'gray' ? theme : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
