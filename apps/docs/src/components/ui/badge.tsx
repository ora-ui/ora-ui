import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success';

const themeColorMap: Record<Theme, string> = {
  gray: 'gray',
  accent: 'accent',
  destructive: 'destructive',
  warning: 'warning',
  success: 'success',
};

const getThemeStyles = (theme: Theme): React.CSSProperties => {
  const color = themeColorMap[theme];
  const isGray = theme === 'gray';
  return {
    '--background-solid': isGray ? `var(--${color}-950)` : `var(--${color}-700)`,
    '--background-ui': `var(--${color}-200)`,
    '--line-ui': `var(--${color}-400)`,
    '--foreground': isGray ? `var(--${color}-950)` : `var(--${color}-900)`,
    '--foreground-solid': theme === 'warning' ? 'black' : isGray ? `var(--${color}-50)` : 'white',
  } as React.CSSProperties;
};

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent font-medium whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        solid: 'bg-background-solid text-foreground-solid',
        soft: 'bg-background-ui text-foreground',
        outline: 'border-line-ui text-foreground',
        surface: 'border-line-ui bg-background-ui/40 text-foreground',
      },
      size: {
        default: 'max-h-6 px-1.5 py-0.5 text-xs',
        icon: 'size-5 p-0 text-xs',
      },
      theme: {
        gray: '',
        accent: '',
        destructive: '',
        warning: '',
        success: '',
      },
    },
    defaultVariants: {
      variant: 'soft',
      size: 'default',
      theme: 'gray',
    },
  }
);

function Badge({
  className,
  variant = 'soft',
  size = 'default',
  theme = 'gray',
  render,
  style,
  ...props
}: useRender.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { style?: React.CSSProperties }) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant, size, theme }), className),
        style: { ...getThemeStyles(theme as Theme), ...style },
      },
      props
    ),
    render,
    state: {
      slot: 'badge',
      variant,
    },
  });
}

export { Badge, badgeVariants };
