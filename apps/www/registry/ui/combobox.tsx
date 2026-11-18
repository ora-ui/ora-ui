'use client';

import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import { CaretDownIcon, CheckIcon, XIcon } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { InputGroup, InputGroupButton } from '@/registry/ui/input-group';
import { inputVariants } from '@/registry/ui/input';

type ComboboxVariant = 'soft' | 'solid';
type ComboboxTheme = 'gray' | 'accent' | (string & {});
type ComboboxDensity = 'none' | 'compact' | 'comfortable';

interface ComboboxContextValue {
  variant: ComboboxVariant;
  theme: ComboboxTheme;
  density: ComboboxDensity;
}

const ComboboxContext = React.createContext<ComboboxContextValue>({
  variant: 'soft',
  theme: 'gray',
  density: 'comfortable',
});

const densityPad: Record<ComboboxDensity, string> = {
  none: 'p-0',
  compact: 'p-0.5',
  comfortable: 'p-1',
};

const comboboxInputGroupVariants = cva(
  [
    'not-in-data-[slot=combobox-content]:has-[[data-slot=combobox-input]:focus-visible]:border-focus not-in-data-[slot=combobox-content]:has-[[data-slot=combobox-input]:focus-visible]:outline-2 not-in-data-[slot=combobox-content]:has-[[data-slot=combobox-input]:focus-visible]:outline-focus',
    'has-[button]:pr-1 has-[[data-slot=combobox-chips]]:h-auto has-[[data-slot=combobox-chips]]:min-h-9',
  ],
  {
    variants: {
      variant: {
        surface: 'bg-ui-subtle border-border',
        outline: 'border-border shadow-2xs',
        soft: 'bg-ui border-transparent',
      },
    },
    defaultVariants: {
      variant: 'surface',
    },
  }
);

const Combobox = ComboboxPrimitive.Root;

function ComboboxInputGroup({
  className,
  variant = 'surface',
  ...props
}: ComboboxPrimitive.InputGroup.Props & VariantProps<typeof comboboxInputGroupVariants>) {
  return (
    <ComboboxPrimitive.InputGroup
      data-slot="combobox-input-group"
      data-variant={variant}
      render={<InputGroup />}
      className={cn(comboboxInputGroupVariants({ variant }), className)}
      {...props}
    />
  );
}

function ComboboxInput({ className, ...props }: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        inputVariants(),
        'h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:outline-0 aria-invalid:outline-0',
        className
      )}
      {...props}
    />
  );
}

function ComboboxTrigger({ children, ...props }: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      aria-label={children ? undefined : 'Open popup'}
      {...props}
    >
      {children ?? <ComboboxIcon />}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxIcon({ className, ...props }: ComboboxPrimitive.Icon.Props) {
  return (
    <ComboboxPrimitive.Icon
      data-slot="combobox-icon"
      render={<CaretDownIcon className={cn('pointer-events-none', className)} />}
      {...props}
    />
  );
}

function ComboboxClear({ children, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      aria-label={children ? undefined : 'Clear selection'}
      {...props}
    >
      {children ?? <XIcon className="pointer-events-none" />}
    </ComboboxPrimitive.Clear>
  );
}

const ComboboxValue = ComboboxPrimitive.Value;

function ComboboxChips({ className, ...props }: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      className={cn('flex min-w-0 flex-1 flex-wrap items-center gap-1 py-1 pl-1.5', className)}
      {...props}
    />
  );
}

function ComboboxChip({ className, children, ...props }: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        'flex h-6 w-fit cursor-default items-center gap-1 rounded-[max(calc(var(--radius)-4px),2px)] bg-interactive pr-0.5 pl-1.5 text-xs font-medium whitespace-nowrap text-primary outline-none data-highlighted:bg-interactive-strong has-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipRemove({ className, children, ...props }: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      data-slot="combobox-chip-remove"
      aria-label={children ? undefined : 'Remove'}
      className={cn(
        "flex size-5 items-center justify-center rounded-[inherit] text-muted outline-none hover:bg-interactive-subtle hover:text-primary focus-visible:outline-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    >
      {children ?? <XIcon />}
    </ComboboxPrimitive.ChipRemove>
  );
}

const comboboxContentBaseStyles = [
  'group/combobox-content relative isolate z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-36 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-md bg-overlay text-primary shadow-md ring-1 ring-line duration-100',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
  '*:data-[slot=combobox-input-group]:m-1 *:data-[slot=combobox-input-group]:w-auto *:data-[slot=combobox-input-group]:rounded-(--menu-item-radius)',
] as const;

function ComboboxContent({
  className,
  children,
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
  alignOffset = 0,
  variant = 'soft',
  theme = 'gray',
  density = 'comfortable',
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<ComboboxPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: ComboboxVariant;
    theme?: ComboboxTheme;
    density?: ComboboxDensity;
  }) {
  return (
    <ComboboxContext.Provider value={{ variant, theme, density }}>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          className="isolate z-50"
        >
          <ComboboxPrimitive.Popup
            data-slot="combobox-content"
            data-variant={variant}
            data-theme={theme !== 'gray' ? theme : undefined}
            data-density={density}
            className={cn(comboboxContentBaseStyles, className)}
            {...props}
          >
            {children}
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxContext.Provider>
  );
}

function ComboboxList({
  className,
  density: densityProp,
  ...props
}: ComboboxPrimitive.List.Props & { density?: ComboboxDensity }) {
  const context = React.useContext(ComboboxContext);
  const density = densityProp ?? context.density;
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        'min-h-0 flex-1 scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain outline-none data-empty:p-0',
        densityPad[density],
        className
      )}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  variant: variantProp,
  density: densityProp,
  ...props
}: ComboboxPrimitive.Item.Props & { variant?: ComboboxVariant; density?: ComboboxDensity }) {
  const context = React.useContext(ComboboxContext);
  const variant = variantProp ?? context.variant;
  const density = densityProp ?? context.density;
  const flushRadius = density === 'none';

  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      data-variant={variant}
      className={cn(
        'relative flex h-7 w-full cursor-default items-center gap-1.5 pr-8 pl-1.5 text-sm text-gray-950 outline-hidden select-none',
        flushRadius ? 'rounded-none' : 'rounded-(--menu-item-radius)',
        variant === 'solid'
          ? 'data-highlighted:bg-solid data-highlighted:text-on-solid data-highlighted:**:text-on-solid'
          : 'data-highlighted:bg-interactive data-highlighted:text-(--menu-item-highlight-text)',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
            <CheckIcon className="pointer-events-none" />
          </span>
        }
      />
    </ComboboxPrimitive.Item>
  );
}

function ComboboxRow({ className, ...props }: ComboboxPrimitive.Row.Props) {
  return <ComboboxPrimitive.Row data-slot="combobox-row" className={className} {...props} />;
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn('scroll-my-1', className)}
      {...props}
    />
  );
}

function ComboboxLabel({ className, ...props }: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn('px-1.5 py-1 text-xs text-muted', className)}
      {...props}
    />
  );
}

function ComboboxSeparator({ className, ...props }: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-line', className)}
      {...props}
    />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn('px-2 py-3 text-center text-sm text-muted empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

function ComboboxStatus({ className, ...props }: ComboboxPrimitive.Status.Props) {
  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      className={cn('px-2 py-1.5 text-xs text-muted empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

const ComboboxCollection = ComboboxPrimitive.Collection;

export {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxRow,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  comboboxInputGroupVariants,
};
