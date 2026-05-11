'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-dynamic text-sm text-ui-label font-medium select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-focus",
  {
    variants: {
      variant: {
        solid:
          'bg-fill text-on-fill hover:bg-fill/90 active:bg-fill/80 focus-visible:outline-focus-fill focus-visible:outline-offset-2',
        outline: 'border border-line-ui bg-transparent hover:bg-hover/30 active:bg-active/40',
        surface: 'border border-line-ui bg-ui hover:border-line-ui hover:bg-hover active:bg-active',
        soft: 'bg-ui hover:bg-hover active:bg-active',
        ghost: 'hover:bg-hover active:bg-active',
      },
      size: {
        sm: "h-8 rounded-dynamic gap-1.5 px-3 has-[>svg]:px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: 'h-7.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
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
