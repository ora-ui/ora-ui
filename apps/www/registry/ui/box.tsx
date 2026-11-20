import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

function Box({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className,
        ...({ 'data-slot': 'box' } as React.HTMLAttributes<HTMLDivElement>),
      },
      props
    ),
    render,
    state: { slot: 'box' },
  });
}

export { Box };
