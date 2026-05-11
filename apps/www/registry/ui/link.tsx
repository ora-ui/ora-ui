import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

type Theme = 'gray' | 'accent' | 'destructive' | (string & {});

const linkVariants = cva(
  'decoration-1 decoration-secondary underline-offset-[calc(.025em+2px)] focus-visible:outline-2 focus-visible:outline-focus rounded-xs',
  {
    variants: {
      underline: {
        always: 'underline',
        hover: 'no-underline hover:underline',
        none: 'no-underline',
      },
      theme: {
        gray: '',
        accent: 'text-secondary',
        destructive: 'text-secondary',
      },
    },
    defaultVariants: {
      underline: 'hover',
      theme: 'gray',
    },
  }
);

interface LinkProps
  extends useRender.ComponentProps<'a'>, Omit<VariantProps<typeof linkVariants>, 'theme'> {
  theme?: Theme;
}

function Link({ className, underline, theme = 'gray', render, ...props }: LinkProps) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn(
          linkVariants({ underline, theme: theme as 'gray' | 'accent' | 'destructive', className })
        ),
        ...({
          'data-slot': 'link',
          'data-theme': theme !== 'gray' ? theme : undefined,
        } as React.HTMLAttributes<HTMLAnchorElement>),
      },
      props
    ),
    render,
    state: { slot: 'link' },
  });
}

export { Link, linkVariants };
