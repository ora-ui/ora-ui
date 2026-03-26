'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type Theme = 'gray' | 'accent' | 'destructive';

const themeColorMap: Record<Theme, string> = {
  gray: 'gray',
  accent: 'accent',
  destructive: 'destructive',
};

const getThemeStyles = (theme: Theme): React.CSSProperties => {
  const color = themeColorMap[theme];
  const isColor = theme !== 'gray';
  return {
    '--ui': `var(--${color}-100)`,
    '--ui-hover': `var(--${color}-200)`,
    '--ui-active': `var(--${color}-300)`,
    '--line-ui': `var(--${color}-600)`,
    '--focus': `var(--${color}-500)`,
    '--solid': isColor ? `var(--${color}-700)` : `var(--${color}-950)`,
    '--text-secondary': isColor ? `var(--${color}-800)` : `var(--${color}-900)`,
    '--text-primary': isColor ? `var(--${color}-900)` : `var(--${color}-950)`,
    '--text-solid': 'white',
  } as React.CSSProperties;
};

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-all select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-(--focus) aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        solid:
          'bg-solid hover:bg-solid/90 active:bg-solid/80 text-text-solid focus-visible:outline-offset-2',
        outline:
          'border border-line-ui hover:bg-ui-hover active:bg-ui-active text-text-secondary hover:text-text-primary',
        surface:
          'border border-line-ui bg-ui hover:bg-ui-hover active:bg-ui-active text-text-secondary hover:text-text-primary',
        soft: 'bg-ui hover:bg-ui-hover active:bg-ui-active text-text-secondary hover:text-text-primary',
        ghost: 'hover:bg-ui-hover active:bg-ui-active text-text-secondary hover:text-text-primary',
      },
      size: {
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: 'h-7.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-7.5',
        'icon-sm': 'size-7',
        'icon-lg': 'size-9',
      },
      theme: {
        gray: '',
        accent: '',
        destructive: '',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        theme: 'gray',
        class: 'text-gray-50 focus-visible:outline-(--solid)/65',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      theme: 'gray',
      size: 'md',
    },
  }
);

function Button({
  className,
  variant = 'solid',
  theme = 'gray',
  size = 'md',
  style,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className, theme }))}
      style={{ ...getThemeStyles(theme as Theme), ...style }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
