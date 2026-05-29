'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from '@base-ui/react/select';
import { CheckIcon, CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';

import { cn } from '@/registry/lib/utils';

type SelectVariant = 'soft' | 'solid';
type SelectTheme = 'gray' | 'accent';
type SelectIconPosition = 'start' | 'end';
type SelectDensity = 'none' | 'compact' | 'comfortable';

interface SelectContextValue {
  variant: SelectVariant;
  theme: SelectTheme;
  iconPosition: SelectIconPosition;
  density: SelectDensity;
}

const SelectContext = React.createContext<SelectContextValue>({
  variant: 'soft',
  theme: 'gray',
  iconPosition: 'end',
  density: 'comfortable',
});

const densityPad: Record<SelectDensity, string> = {
  none: 'p-0',
  compact: 'p-0.5',
  comfortable: 'p-1',
};

// alignItemWithTrigger aligns ItemText.left with SelectValue.left. Total item
// text offset = popup_pad + group_pad + item_pl. Trigger value offset =
// button px (12). Density shifts that balance; compensate on positioner.
const iconStartPositionerShift: Record<SelectDensity, string> = {
  none: '',
  compact: 'translate-x-1',
  comfortable: 'translate-x-2',
};

// For iconEnd, item pl-1.5 (6) vs trigger px-3 (12) leaves a -6 base
// difference. Density adds to text offset symmetrically around compact.
const iconEndPositionerShift: Record<SelectDensity, string> = {
  none: '-translate-x-1',
  compact: '',
  comfortable: 'translate-x-1',
};

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  const { density } = React.useContext(SelectContext);
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn('scroll-my-1', densityPad[density], className)}
      {...props}
    />
  );
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn('flex flex-1 text-left', className)}
      {...props}
    />
  );
}

function SelectTrigger(props: SelectPrimitive.Trigger.Props) {
  return <SelectPrimitive.Trigger data-slot="select-trigger" {...props} />;
}

function SelectIcon(props: React.ComponentProps<typeof SelectPrimitive.Icon>) {
  return (
    <SelectPrimitive.Icon
      data-slot="select-icon"
      render={<CaretDownIcon className="pointer-events-none" />}
      {...props}
    />
  );
}

const selectContentBaseStyles = [
  'relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-overlay text-primary shadow-md ring-1 ring-line duration-100',
  'data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
] as const;

function SelectContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  alignItemWithTrigger = false,
  variant = 'soft',
  theme = 'gray',
  iconPosition = 'end',
  density = 'comfortable',
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset' | 'alignItemWithTrigger'
  > & {
    variant?: SelectVariant;
    theme?: SelectTheme;
    iconPosition?: SelectIconPosition;
    density?: SelectDensity;
  }) {
  return (
    <SelectContext.Provider value={{ variant, theme, iconPosition, density }}>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          alignItemWithTrigger={alignItemWithTrigger}
          className={cn(
            'isolate z-50',
            iconPosition === 'start'
              ? iconStartPositionerShift[density]
              : iconEndPositionerShift[density]
          )}
        >
          <SelectPrimitive.Popup
            data-slot="select-content"
            data-variant={variant}
            data-theme={theme !== 'gray' ? theme : undefined}
            data-density={density}
            data-align-trigger={alignItemWithTrigger}
            className={cn(selectContentBaseStyles, densityPad[density], className)}
            {...props}
          >
            <SelectScrollUpButton />
            <SelectPrimitive.List>{children}</SelectPrimitive.List>
            <SelectScrollDownButton />
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectContext.Provider>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn('px-1.5 py-1 text-xs text-muted', className)}
      {...props}
    />
  );
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  const { variant, theme, iconPosition, density } = React.useContext(SelectContext);
  const iconStart = iconPosition === 'start';
  const accent = theme === 'accent';
  const flushRadius = density === 'none';

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'relative flex w-full cursor-default items-center gap-1.5 h-7 text-sm text-gray-primary outline-hidden select-none',
        flushRadius ? 'rounded-none' : 'rounded-(--menu-item-radius)',
        iconStart ? 'pl-7 pr-2' : 'pl-1.5 pr-8',
        variant === 'solid'
          ? 'data-highlighted:bg-fill data-highlighted:text-on-fill data-highlighted:**:text-on-fill'
          : accent
            ? 'data-highlighted:bg-hover/40 data-highlighted:text-secondary'
            : 'data-highlighted:bg-hover data-highlighted:text-gray-primary',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span
            className={cn(
              'pointer-events-none absolute flex size-4 items-center justify-center',
              iconStart ? 'left-1.5' : 'right-2'
            )}
          >
            <CheckIcon className="pointer-events-none" />
          </span>
        }
      />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-line', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-overlay py-1 text-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <CaretUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-overlay py-1 text-muted [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <CaretDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
