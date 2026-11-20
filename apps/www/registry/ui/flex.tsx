import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/registry/lib/utils';

function Flex({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn('flex', className),
        ...({ 'data-slot': 'flex' } as React.HTMLAttributes<HTMLDivElement>),
      },
      props
    ),
    render,
    state: { slot: 'flex' },
  });
}

export { Flex };
