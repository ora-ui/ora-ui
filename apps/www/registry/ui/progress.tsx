'use client';

import * as React from 'react';
import { Progress as ProgressPrimitive } from '@base-ui/react/progress';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const progressTrackVariants = cva(
  'group/progress-track relative block h-(--progress-height) w-full col-span-2 overflow-hidden rounded-dynamic bg-ui',
  {
    variants: {
      size: {
        sm: '[--progress-height:--spacing(1)]',
        md: '[--progress-height:--spacing(2)]',
        lg: '[--progress-height:--spacing(3)]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const progressIndicatorVariants = cva(
  'block h-full rounded-none transition-[width] duration-300 ease-out motion-reduce:transition-none data-indeterminate:w-2/5 data-indeterminate:motion-safe:animate-pulse',
  {
    variants: {
      variant: {
        solid: 'bg-solid',
        soft: 'bg-border',
      },
    },
    defaultVariants: {
      variant: 'solid',
    },
  }
);

type Variant = NonNullable<VariantProps<typeof progressIndicatorVariants>['variant']>;
type Size = NonNullable<VariantProps<typeof progressTrackVariants>['size']>;
type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success' | (string & {});

const ProgressContext = React.createContext<{
  variant: Variant;
  size: Size;
  theme: Theme;
}>({
  variant: 'solid',
  size: 'md',
  theme: 'gray',
});

function Progress({
  className,
  variant = 'solid',
  size = 'md',
  theme = 'gray',
  children,
  ...props
}: ProgressPrimitive.Root.Props & {
  variant?: Variant;
  size?: Size;
  theme?: Theme;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      data-size={size}
      className={cn('grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2', className)}
      {...props}
    >
      <ProgressContext.Provider value={{ variant, size, theme }}>
        {children}
      </ProgressContext.Provider>
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
  variant,
  theme,
  ...props
}: ProgressPrimitive.Indicator.Props & { variant?: Variant; theme?: Theme }) {
  const context = React.useContext(ProgressContext);
  const resolvedVariant = variant ?? context.variant;
  const resolvedTheme = theme ?? context.theme;

  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      data-variant={resolvedVariant}
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      className={cn(progressIndicatorVariants({ variant: resolvedVariant }), className)}
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
  progressIndicatorVariants,
};
