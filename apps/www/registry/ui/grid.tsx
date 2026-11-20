import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/registry/lib/utils';

function Grid({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn('grid', className),
        ...({ 'data-slot': 'grid' } as React.HTMLAttributes<HTMLDivElement>),
      },
      props
    ),
    render,
    state: { slot: 'grid' },
  });
}

export { Grid };
