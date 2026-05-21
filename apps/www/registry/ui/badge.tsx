import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

/**
 * Slots: badge
 */
const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[min(var(--radius),max(8px,calc(var(--radius)-10px)))] border border-transparent whitespace-nowrap font-medium text-ui-label focus-visible:outline-2 focus-visible:outline-focus [&>svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
  {
    variants: {
      variant: {
        solid:
          'bg-fill text-on-fill focus-visible:outline-focus-fill focus-visible:outline-offset-2',
        soft: 'bg-ui',
        outline: 'border-line-ui bg-transparent',
        surface: 'border-line-ui bg-ui/40',
      },
      size: {
        default: 'min-w-4.5 h-5 px-1.5 text-xs',
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
  ...props
}: useRender.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: 'span',
    props: mergeProps<'span'>(
      {
        className: cn(badgeVariants({ variant, size, theme }), className),
        ...({
          'data-slot': 'badge',
          'data-variant': variant,
          'data-theme': theme !== 'gray' ? theme : undefined,
        } as React.HTMLAttributes<HTMLSpanElement>),
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
