'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const sliderTrackVariants = cva(
  'relative overflow-hidden rounded-[calc(var(--radius)*0.25)] bg-ui group-data-[orientation=horizontal]/slider:w-full group-data-[orientation=vertical]/slider:h-full group-data-invalid/slider:outline-1 group-data-invalid/slider:outline-destructive-700',
  {
    variants: {
      size: {
        sm: 'group-data-[orientation=horizontal]/slider:h-(--slider-height,--spacing(1)) group-data-[orientation=vertical]/slider:w-(--slider-height,--spacing(1))',
        md: 'group-data-[orientation=horizontal]/slider:h-(--slider-height,--spacing(2)) group-data-[orientation=vertical]/slider:w-(--slider-height,--spacing(2))',
        lg: 'group-data-[orientation=horizontal]/slider:h-(--slider-height,--spacing(3)) group-data-[orientation=vertical]/slider:w-(--slider-height,--spacing(3))',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const sliderThumbVariants = cva(
  'block shrink-0 rounded-full border border-border-strong bg-white outline-offset-2 outline-focus transition-transform select-none has-focus-visible:outline-2 data-theme:outline-(--ring) active:scale-110 motion-reduce:transition-none group-data-disabled/slider:cursor-not-allowed group-data-invalid/slider:border-destructive-700 group-data-invalid/slider:has-focus-visible:outline-destructive-700',
  {
    variants: {
      size: {
        sm: 'size-3',
        md: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

type Size = NonNullable<VariantProps<typeof sliderTrackVariants>['size']>;
type Theme = 'gray' | 'accent' | (string & {});

const SliderContext = React.createContext<{
  size: Size;
  theme: Theme;
}>({
  size: 'md',
  theme: 'gray',
});

function Slider({
  className,
  size = 'md',
  theme = 'gray',
  children,
  ...props
}: SliderPrimitive.Root.Props & {
  size?: Size;
  theme?: Theme;
}) {
  const contextValue = React.useMemo(() => ({ size, theme }), [size, theme]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-size={size}
      className={cn(
        'group/slider grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 data-[orientation=vertical]:flex data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-center data-[orientation=vertical]:gap-y-2',
        className
      )}
      {...props}
    >
      <SliderContext.Provider value={contextValue}>{children}</SliderContext.Provider>
    </SliderPrimitive.Root>
  );
}

function SliderLabel({ className, ...props }: SliderPrimitive.Label.Props) {
  return (
    <SliderPrimitive.Label
      data-slot="slider-label"
      className={cn('col-start-1 text-sm font-medium text-primary', className)}
      {...props}
    />
  );
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn('col-start-2 text-right text-sm text-secondary tabular-nums', className)}
      {...props}
    />
  );
}

function SliderControl({ className, ...props }: SliderPrimitive.Control.Props) {
  return (
    <SliderPrimitive.Control
      data-slot="slider-control"
      className={cn(
        'relative col-span-full flex touch-none items-center select-none data-[orientation=horizontal]:w-full data-[orientation=horizontal]:py-2 data-[orientation=vertical]:min-h-0 data-[orientation=vertical]:flex-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2 data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function SliderTrack({ className, size, ...props }: SliderPrimitive.Track.Props & { size?: Size }) {
  const context = React.useContext(SliderContext);
  const resolvedSize = size ?? context.size;

  return (
    <SliderPrimitive.Track
      data-slot="slider-track"
      data-size={resolvedSize}
      className={cn(sliderTrackVariants({ size: resolvedSize }), className)}
      {...props}
    />
  );
}

function SliderIndicator({
  className,
  theme,
  ...props
}: SliderPrimitive.Indicator.Props & { theme?: Theme }) {
  const context = React.useContext(SliderContext);
  const resolvedTheme = theme ?? context.theme;

  return (
    <SliderPrimitive.Indicator
      data-slot="slider-indicator"
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      className={cn('rounded-none bg-solid', className)}
      {...props}
    />
  );
}

function SliderThumb({
  className,
  size,
  theme,
  ...props
}: SliderPrimitive.Thumb.Props & { size?: Size; theme?: Theme }) {
  const context = React.useContext(SliderContext);
  const resolvedSize = size ?? context.size;
  const resolvedTheme = theme ?? context.theme;

  return (
    <SliderPrimitive.Thumb
      data-slot="slider-thumb"
      data-size={resolvedSize}
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      className={cn(sliderThumbVariants({ size: resolvedSize }), className)}
      {...props}
    />
  );
}

export {
  Slider,
  SliderLabel,
  SliderValue,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  sliderTrackVariants,
  sliderThumbVariants,
};
