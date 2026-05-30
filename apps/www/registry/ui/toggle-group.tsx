'use client';

import * as React from 'react';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { Toggle, toggleVariants } from '@/registry/ui/toggle';

// --item-radius is set inline on the parent (see ToggleGroup body) since
// conditional Tailwind selectors compete with the item's base radius.
// Density sets --group-pad (container padding) and --item-rad-cut.
const toggleGroupVariants = cva(['group/toggle-group flex w-fit p-(--group-pad)'], {
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
    density: {
      none: '[--group-pad:0px] [--item-rad-cut:0px]',
      compact: '[--group-pad:--spacing(0.5)] [--item-rad-cut:2px]',
      comfortable: '[--group-pad:--spacing(1)] [--item-rad-cut:3px]',
    },
  },
  compoundVariants: [
    // density=none has no padding, but bordered containers still need a
    // 1px cut so items inscribe inside the container border.
    { variant: ['outline', 'surface'], density: 'none', class: '[--item-rad-cut:1px]' },
  ],
  defaultVariants: {
    variant: 'none',
    orientation: 'horizontal',
    attached: false,
    density: 'comfortable',
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
  variant = 'none',
  itemVariant = 'soft',
  size = 'md',
  theme = 'gray',
  attached = false,
  orientation = 'horizontal',
  density = 'comfortable',
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleGroupVariants> & {
    itemVariant?: ItemVariant;
    size?: ItemSize;
    theme?: Theme;
  }) {
  const itemRadiusClass =
    variant === 'none'
      ? '[--item-radius:var(--radius-dynamic)]'
      : '[--item-radius:calc(var(--radius-dynamic)-var(--item-rad-cut))]';
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-item-variant={itemVariant}
      data-size={size}
      data-attached={attached}
      data-orientation={orientation}
      data-density={density}
      className={cn(
        toggleGroupVariants({ variant, orientation, attached, density, className }),
        itemRadiusClass
      )}
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
        // --item-radius is set by the parent (see ToggleGroup body).
        // ! ensures we override Toggle's base rounded-dynamic.
        'rounded-(--item-radius)!',
        // Attached: middle items lose their inner-side radius so they butt
        // up against neighbors; first/last keep --item-radius on outer corners.
        'group-data-[attached=true]/toggle-group:group-data-horizontal/toggle-group:not-first:rounded-l-none!',
        'group-data-[attached=true]/toggle-group:group-data-horizontal/toggle-group:not-last:rounded-r-none!',
        'group-data-[attached=true]/toggle-group:group-data-vertical/toggle-group:not-first:rounded-t-none!',
        'group-data-[attached=true]/toggle-group:group-data-vertical/toggle-group:not-last:rounded-b-none!',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=outline]/toggle-group:group-data-horizontal/toggle-group:not-first:-ml-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=outline]/toggle-group:group-data-vertical/toggle-group:not-first:-mt-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=on-solid]/toggle-group:group-data-horizontal/toggle-group:not-first:-ml-px',
        'group-data-[attached=true]/toggle-group:group-data-[item-variant=on-solid]/toggle-group:group-data-vertical/toggle-group:not-first:-mt-px',
        className
      )}
      {...props}
    >
      {children}
    </Toggle>
  );
}

export { ToggleGroup, ToggleGroupItem, toggleGroupVariants };
