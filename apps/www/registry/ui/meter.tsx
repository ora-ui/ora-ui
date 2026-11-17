'use client';

import * as React from 'react';
import { Meter as MeterPrimitive } from '@base-ui/react/meter';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';

const meterTrackVariants = cva(
  'col-span-2 w-full overflow-hidden rounded-[calc(var(--radius)*0.25)] bg-ui',
  {
    variants: {
      size: {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const meterIndicatorVariants = cva(
  'block h-full rounded-none transition-[width] duration-300 ease-out motion-reduce:transition-none',
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

type Variant = NonNullable<VariantProps<typeof meterIndicatorVariants>['variant']>;
type Size = NonNullable<VariantProps<typeof meterTrackVariants>['size']>;
type Theme = 'gray' | 'accent' | 'destructive' | 'warning' | 'success' | (string & {});

const MeterContext = React.createContext<{
  variant: Variant;
  size: Size;
  theme: Theme;
}>({
  variant: 'solid',
  size: 'md',
  theme: 'gray',
});

function Meter({
  className,
  variant = 'solid',
  size = 'md',
  theme = 'gray',
  children,
  ...props
}: MeterPrimitive.Root.Props & {
  variant?: Variant;
  size?: Size;
  theme?: Theme;
}) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      data-variant={variant}
      data-size={size}
      className={cn('grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2', className)}
      {...props}
    >
      <MeterContext.Provider value={{ variant, size, theme }}>{children}</MeterContext.Provider>
    </MeterPrimitive.Root>
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn('col-start-1 text-sm font-medium text-primary', className)}
      {...props}
    />
  );
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn('col-start-2 text-right text-sm text-secondary tabular-nums', className)}
      {...props}
    />
  );
}

function MeterTrack({ className, size, ...props }: MeterPrimitive.Track.Props & { size?: Size }) {
  const context = React.useContext(MeterContext);
  const resolvedSize = size ?? context.size;

  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      data-size={resolvedSize}
      className={cn(meterTrackVariants({ size: resolvedSize }), className)}
      {...props}
    />
  );
}

function MeterIndicator({
  className,
  variant,
  theme,
  ...props
}: MeterPrimitive.Indicator.Props & { variant?: Variant; theme?: Theme }) {
  const context = React.useContext(MeterContext);
  const resolvedVariant = variant ?? context.variant;
  const resolvedTheme = theme ?? context.theme;

  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      data-variant={resolvedVariant}
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      className={cn(meterIndicatorVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
}

export {
  Meter,
  MeterLabel,
  MeterValue,
  MeterTrack,
  MeterIndicator,
  meterTrackVariants,
  meterIndicatorVariants,
};
