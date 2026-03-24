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
  const colorVar = themeColorMap[theme];
  return {
    '--badge-theme-50': `var(--${colorVar}-50)`,
    '--badge-theme-100': `var(--${colorVar}-100)`,
    '--badge-theme-200': `var(--${colorVar}-200)`,
    '--badge-theme-300': `var(--${colorVar}-300)`,
    '--badge-theme-400': `var(--${colorVar}-400)`,
    '--badge-theme-500': `var(--${colorVar}-500)`,
    '--badge-theme-600': `var(--${colorVar}-600)`,
    '--badge-theme-700': `var(--${colorVar}-700)`,
    '--badge-theme-800': `var(--${colorVar}-800)`,
    '--badge-theme-900': `var(--${colorVar}-900)`,
    '--badge-theme-950': `var(--${colorVar}-950)`,
  } as React.CSSProperties;
};

const badgeVariants = cva(
  'group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent font-medium whitespace-nowrap focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        solid: 'bg-(--badge-theme-700) text-white',
        soft: 'bg-(--badge-theme-200)/80 text-(--badge-theme-900)',
        outline: 'border-(--badge-theme-400) text-(--badge-theme-800)',
        surface: 'border-(--badge-theme-400) bg-(--badge-theme-200)/40 text-(--badge-theme-800)',
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
    compoundVariants: [
      {
        variant: 'solid',
        theme: 'gray',
        class: 'bg-(--badge-theme-950) text-(--badge-theme-50)',
      },
      {
        variant: 'outline',
        theme: 'gray',
        class: 'text-(--badge-theme-950)',
      },
      {
        variant: 'surface',
        theme: 'gray',
        class: 'text-(--badge-theme-950)',
      },
      {
        variant: 'soft',
        theme: 'gray',
        class: 'text-(--badge-theme-950)',
      },
    ],
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
