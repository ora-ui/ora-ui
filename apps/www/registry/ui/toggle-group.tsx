'use client';

import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { Toggle, toggleVariants } from '@/registry/ui/toggle';

const toggleGroupVariants = cva('group/toggle-group flex w-fit', {
  variants: {
    variant: {
      none: '',
      outline: 'rounded-dynamic border border-line-ui',
      surface: 'rounded-dynamic border border-line-ui bg-ui/50',
      soft: 'rounded-dynamic bg-ui',
      solid: 'rounded-dynamic bg-fill',
    },
    orientation: {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-stretch',
    },
    attached: {
      true: 'gap-0',
      false: 'gap-1',
    },
  },
  compoundVariants: [
    { variant: ['outline', 'surface', 'soft', 'solid'], attached: false, class: 'p-1' },
  ],
  defaultVariants: {
    variant: 'none',
    orientation: 'horizontal',
    attached: false,
  },
});

type ItemVariant = VariantProps<typeof toggleVariants>['variant'];
type ItemSize = VariantProps<typeof toggleVariants>['size'];
type Theme = 'gray' | 'accent' | (string & {});

const ToggleGroupContext = React.createContext<{
  itemVariant?: ItemVariant;
  size?: ItemSize;
  theme?: Theme;
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
}>({
  itemVariant: 'soft',
  size: 'md',
  theme: 'gray',
  attached: false,
  orientation: 'horizontal',
});

function ToggleGroup({
  className,
  variant,
  itemVariant = 'soft',
  size = 'md',
  theme = 'gray',
  attached = false,
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleGroupVariants> & {
    itemVariant?: ItemVariant;
    size?: ItemSize;
    theme?: Theme;
  }) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-item-variant={itemVariant}
      data-size={size}
      data-attached={attached}
      data-orientation={orientation}
      className={cn(toggleGroupVariants({ variant, orientation, attached, className }))}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ itemVariant, size, theme, attached: !!attached, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  theme,
  ...props
}: React.ComponentProps<typeof Toggle>) {
  const context = React.useContext(ToggleGroupContext);
  // Local props win over inherited group values.
  const resolvedVariant = variant ?? context.itemVariant;
  const resolvedSize = size ?? context.size;
  const resolvedTheme = theme ?? context.theme;

  return (
    <Toggle
      data-slot="toggle-group-item"
      variant={resolvedVariant}
      size={resolvedSize}
      theme={resolvedTheme}
      className={cn(
        'shrink-0 focus:z-10 focus-visible:z-10',
        // Concentric radii (optical, not math): container padding is 4px but
        // pure (outer - 4px) reads pinched at small radii. Subtract 3px so
        // curves enter at a tangent the eye reads as parallel.
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=false]/toggle-group:rounded-[max(0px,calc(var(--radius-dynamic)-3px))]',
        // Attached: kill inner corners, ends match the container exactly.
        'group-data-[attached=true]/toggle-group:rounded-none',
        'group-data-[attached=true]/toggle-group:group-data-horizontal/toggle-group:first:rounded-l-dynamic',
        'group-data-[attached=true]/toggle-group:group-data-horizontal/toggle-group:last:rounded-r-dynamic',
        'group-data-[attached=true]/toggle-group:group-data-vertical/toggle-group:first:rounded-t-dynamic',
        'group-data-[attached=true]/toggle-group:group-data-vertical/toggle-group:last:rounded-b-dynamic',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=outline]/toggle-group:group-data-horizontal/toggle-group:not-first:-ml-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=outline]/toggle-group:group-data-vertical/toggle-group:not-first:-mt-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=on-solid]/toggle-group:group-data-horizontal/toggle-group:not-first:-ml-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=on-solid]/toggle-group:group-data-vertical/toggle-group:not-first:-mt-px',
        // Attached + filled container: items grow on both axes by the would-be
        // 8px padding so proportions match the detached look.
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=sm]/toggle-group:h-9',
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=md]/toggle-group:h-9.5',
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=lg]/toggle-group:h-10.75',
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=sm]/toggle-group:min-w-9',
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=md]/toggle-group:min-w-9.5',
        'not-group-data-[variant=none]/toggle-group:group-data-[attached=true]/toggle-group:group-data-[size=lg]/toggle-group:min-w-11',
        className
      )}
      {...props}
    >
      {children}
    </Toggle>
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants };
