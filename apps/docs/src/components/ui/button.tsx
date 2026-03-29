'use client';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type Theme = 'gray' | 'accent' | 'destructive' | (string & {});

const getThemeStyles = (
  theme: Theme,
  variant: VariantProps<typeof buttonVariants>['variant']
): React.CSSProperties => {
  const isColor = theme !== 'gray';
  const themedSoft = variant === 'soft' && isColor;
  return {
    '--background-ui': themedSoft ? `var(--${theme}-a200)` : `var(--${theme}-a100)`,
    '--hover': themedSoft ? `var(--${theme}-a300)` : `var(--${theme}-a200)`,
    '--active': themedSoft ? `var(--${theme}-a400)` : `var(--${theme}-a300)`,
    '--line-ui': `var(--${theme}-600)`,
    '--focus': `var(--${theme}-500)`,
    '--focus-solid': isColor ? `var(--${theme}-800)` : `var(--${theme}-950)`,
    '--background-solid': isColor ? `var(--${theme}-700)` : `var(--${theme}-950)`,
    '--foreground-subtle': isColor ? `var(--${theme}-800)` : `var(--${theme}-900)`,
    '--foreground': isColor ? `var(--${theme}-900)` : `var(--${theme}-950)`,
    ...(isColor ? { '--foreground-solid': `var(--${theme}-foreground-solid)` } : {}),
  } as React.CSSProperties;
};

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium transition-all select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-focus aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        solid:
          'bg-background-solid hover:bg-background-solid/90 active:bg-background-solid/80 text-foreground-solid focus-visible:outline-focus-solid focus-visible:outline-offset-2',
        outline:
          'border border-line-ui hover:bg-hover active:bg-active  data-[theme=gray]:hover:bg-hover/50 data-[theme=gray]:active:bg-active/75 text-foreground-subtle hover:text-foreground',
        surface:
          'border border-line-ui/65 bg-background-ui hover:border-line-ui active:bg-active data-[theme=gray]:bg-background-ui/50 data-[theme=gray]:active:bg-active/75 text-foreground-subtle hover:text-foreground',
        soft: 'bg-background-ui hover:bg-hover active:bg-active text-foreground-subtle hover:text-foreground',
        ghost: 'hover:bg-hover active:bg-active text-foreground-subtle hover:text-foreground',
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
        class: 'text-gray-50',
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
      data-theme={theme}
      className={cn(buttonVariants({ variant, size, className, theme }))}
      style={{ ...getThemeStyles(theme as Theme, variant), ...style }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
