import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/registry/lib/utils';

function Center({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn('grid place-items-center', className),
        ...({ 'data-slot': 'center' } as React.HTMLAttributes<HTMLDivElement>),
      },
      props
    ),
    render,
    state: { slot: 'center' },
  });
}

export { Center };
