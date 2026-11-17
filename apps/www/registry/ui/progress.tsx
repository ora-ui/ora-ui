'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const progressTrackVariants = cva('col-span-2 w-full overflow-hidden rounded-xs bg-ui', {
  variants: {
    size: {
      sm: 'h-(--progress-height,--spacing(1))',
      md: 'h-(--progress-height,--spacing(2))',
      lg: 'h-(--progress-height,--spacing(3))',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type Size = NonNullable<VariantProps<typeof progressTrackVariants>['size']>;
type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success' | (string & {});

const ProgressContext = React.createContext<{
  size: Size;
  theme: Theme;
}>({
  size: 'md',
  theme: 'gray',
});

function Progress({
  className,
  size = 'md',
  theme = 'gray',
  children,
  ...props
}: ProgressPrimitive.Root.Props & {
  size?: Size;
  theme?: Theme;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-size={size}
      className={cn('grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2', className)}
      {...props}
    >
      <ProgressContext.Provider value={{ size, theme }}>{children}</ProgressContext.Provider>
    </ProgressPrimitive.Root>
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn('col-start-1 text-sm font-medium text-primary', className)}
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn('col-start-2 text-right text-sm text-secondary tabular-nums', className)}
      {...props}
    />
  );
}

function ProgressTrack({
  className,
  size,
  ...props
}: ProgressPrimitive.Track.Props & { size?: Size }) {
  const context = React.useContext(ProgressContext);
  const resolvedSize = size ?? context.size;

  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      data-size={resolvedSize}
      className={cn(progressTrackVariants({ size: resolvedSize }), className)}
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  theme,
  ...props
}: ProgressPrimitive.Indicator.Props & { theme?: Theme }) {
  const context = React.useContext(ProgressContext);
  const resolvedTheme = theme ?? context.theme;

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      className={cn(
        'block h-full bg-solid rounded-none transition-[width] duration-300 ease-out motion-reduce:transition-none data-indeterminate:w-full data-indeterminate:animate-pulse data-indeterminate:[animation-duration:1s]',
        className
      )}
      {...props}
    />
  );
}

export {
  Progress,
  ProgressLabel,
  ProgressValue,
  ProgressTrack,
  ProgressIndicator,
  progressTrackVariants,
};
