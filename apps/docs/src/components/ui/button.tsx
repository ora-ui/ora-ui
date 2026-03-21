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
  const colorVar = themeColorMap[theme];
  return {
    '--btn-theme-50': `var(--${colorVar}-50)`,
    '--btn-theme-100': `var(--${colorVar}-100)`,
    '--btn-theme-200': `var(--${colorVar}-200)`,
    '--btn-theme-300': `var(--${colorVar}-300)`,
    '--btn-theme-400': `var(--${colorVar}-400)`,
    '--btn-theme-500': `var(--${colorVar}-500)`,
    '--btn-theme-600': `var(--${colorVar}-600)`,
    '--btn-theme-700': `var(--${colorVar}-700)`,
    '--btn-theme-800': `var(--${colorVar}-800)`,
    '--btn-theme-900': `var(--${colorVar}-900)`,
    '--btn-theme-950': `var(--${colorVar}-950)`,
  } as React.CSSProperties;
};

const buttonVariants = cva(
  "group/button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all select-none bg-clip-padding disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0  focus-visible:outline-2 focus-visible:outline-(--btn-theme-500) aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        solid:
          'bg-(--btn-theme-700) hover:bg-(--btn-theme-700)/90 active:bg-(--btn-theme-700)/80 text-white focus-visible:outline-offset-2',
        outline:
          'ring-inset ring-1 ring-(--btn-theme-500) hover:ring-(--btn-theme-500)/75 active:ring-(--btn-theme-500) hover:bg-(--btn-theme-400)/25 active:bg-(--btn-theme-400)/40 text-(--btn-theme-800) dark:border-input',
        surface:
          'ring-inset ring-1 ring-(--btn-theme-500) hover:ring-(--btn-theme-500)/75 active:ring-(--btn-theme-500) bg-(--btn-theme-400)/25 hover:bg-(--btn-theme-400)/50 active:bg-(--btn-theme-400)/65 text-(--btn-theme-800) dark:border-input',
        soft: 'bg-(--btn-theme-300)/50  hover:bg-(--btn-theme-400)/50 active:bg-(--btn-theme-400)/65 text-(--btn-theme-900)',
        ghost:
          'hover:bg-(--btn-theme-400)/50 active:bg-(--btn-theme-400)/65 text-(--btn-theme-900)',
      },
      size: {
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
        md: 'h-9 px-5 has-[>svg]:px-3',
        lg: 'h-10 rounded-sm px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
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
        class:
          'bg-(--btn-theme-950) hover:bg-(--btn-theme-950)/90 active:bg-(--btn-theme-950)/80 text-(--btn-theme-50) focus-visible:outline-(--btn-theme-950)/65',
      },
      {
        variant: 'outline',
        theme: 'gray',
        class:
          'text-(--btn-theme-950) ring-(--btn-theme-700)/75 hover:ring-(--btn-theme-700) active:ring-(--btn-theme-700)',
      },
      {
        variant: 'surface',
        theme: 'gray',
        class:
          'text-(--btn-theme-950) ring-(--btn-theme-700)/75 hover:ring-(--btn-theme-700) active:ring-(--btn-theme-700)',
      },
      {
        variant: 'soft',
        theme: 'gray',
        class: 'text-(--btn-theme-950)',
      },
      {
        variant: 'ghost',
        theme: 'gray',
        class: 'text-(--btn-theme-950)',
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
      className={cn(buttonVariants({ variant, size, className, theme }))}
      style={{ ...getThemeStyles(theme as Theme), ...style }}
      {...props}
    />
  );
}

export { Button, buttonVariants };
