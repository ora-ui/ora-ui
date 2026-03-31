import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success' | (string & {});

const getThemeStyles = (theme: Theme): React.CSSProperties => {
  const isColor = theme !== 'gray';
  return {
    '--background-solid': isColor ? `var(--${theme}-700)` : `var(--${theme}-950)`,
    '--background-ui': `var(--${theme}-200)`,
    '--line-ui': `var(--${theme}-400)`,
    '--foreground': isColor ? `var(--${theme}-900)` : `var(--${theme}-950)`,
    ...(isColor ? { '--foreground-solid': `var(--${theme}-foreground-solid)` } : {}),
  } as React.CSSProperties;
};

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[max(min(var(--radius),6px),calc(var(--radius)-100px))] border border-transparent font-medium whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
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
