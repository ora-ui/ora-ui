'use client';

import * as React from 'react';
import { Autocomplete as AutocompletePrimitive } from '@base-ui/react/autocomplete';
import { CaretDownIcon, XIcon } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { InputGroup, InputGroupButton } from '@/registry/ui/input-group';
import { inputVariants } from '@/registry/ui/input';

type AutocompleteVariant = 'soft' | 'solid';
type AutocompleteTheme = 'gray' | 'accent' | (string & {});
type AutocompleteDensity = 'none' | 'compact' | 'comfortable';

interface AutocompleteContextValue {
  variant: AutocompleteVariant;
  theme: AutocompleteTheme;
  density: AutocompleteDensity;
}

const AutocompleteContext = React.createContext<AutocompleteContextValue>({
  variant: 'soft',
  theme: 'gray',
  density: 'comfortable',
});

const densityPad: Record<AutocompleteDensity, string> = {
  none: 'p-0',
  compact: 'p-0.5',
  comfortable: 'p-1',
};

const autocompleteInputGroupVariants = cva(
  [
    'has-[[data-slot=autocomplete-input]:focus-visible]:border-focus has-[[data-slot=autocomplete-input]:focus-visible]:outline-2 has-[[data-slot=autocomplete-input]:focus-visible]:outline-focus',
    'has-[button]:pr-1',
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

const Autocomplete = AutocompletePrimitive.Root;

function AutocompleteInputGroup({
  className,
  variant = 'surface',
  ...props
}: AutocompletePrimitive.InputGroup.Props & VariantProps<typeof autocompleteInputGroupVariants>) {
  return (
    <AutocompletePrimitive.InputGroup
      data-slot="autocomplete-input-group"
      data-variant={variant}
      render={<InputGroup />}
      className={cn(autocompleteInputGroupVariants({ variant }), className)}
      {...props}
    />
  );
}

function AutocompleteInput({ className, ...props }: AutocompletePrimitive.Input.Props) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        inputVariants(),
        'h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:outline-0 aria-invalid:outline-0',
        className
      )}
      {...props}
    />
  );
}

function AutocompleteTrigger({ children, ...props }: AutocompletePrimitive.Trigger.Props) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      aria-label={children ? undefined : 'Open popup'}
      {...props}
    >
      {children ?? <AutocompleteIcon />}
    </AutocompletePrimitive.Trigger>
  );
}

function AutocompleteIcon({ className, ...props }: AutocompletePrimitive.Icon.Props) {
  return (
    <AutocompletePrimitive.Icon
      data-slot="autocomplete-icon"
      render={<CaretDownIcon className={cn('pointer-events-none', className)} />}
      {...props}
    />
  );
}

function AutocompleteClear({ children, ...props }: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      aria-label={children ? undefined : 'Clear input'}
      {...props}
    >
      {children ?? <XIcon className="pointer-events-none" />}
    </AutocompletePrimitive.Clear>
  );
}

const AutocompleteValue = AutocompletePrimitive.Value;

const autocompleteContentBaseStyles = [
  'group/autocomplete-content relative isolate z-50 flex max-h-(--available-height) w-(--anchor-width) min-w-36 max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-md bg-overlay text-primary shadow-md ring-1 ring-line duration-100',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
] as const;

function AutocompleteContent({
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
}: AutocompletePrimitive.Popup.Props &
  Pick<AutocompletePrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: AutocompleteVariant;
    theme?: AutocompleteTheme;
    density?: AutocompleteDensity;
  }) {
  return (
    <AutocompleteContext.Provider value={{ variant, theme, density }}>
      <AutocompletePrimitive.Portal>
        <AutocompletePrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          className="isolate z-50"
        >
          <AutocompletePrimitive.Popup
            data-slot="autocomplete-content"
            data-variant={variant}
            data-theme={theme !== 'gray' ? theme : undefined}
            data-density={density}
            className={cn(autocompleteContentBaseStyles, className)}
            {...props}
          >
            {children}
          </AutocompletePrimitive.Popup>
        </AutocompletePrimitive.Positioner>
      </AutocompletePrimitive.Portal>
    </AutocompleteContext.Provider>
  );
}

function AutocompleteList({
  className,
  density: densityProp,
  ...props
}: AutocompletePrimitive.List.Props & { density?: AutocompleteDensity }) {
  const context = React.useContext(AutocompleteContext);
  const density = densityProp ?? context.density;
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn(
        'min-h-0 flex-1 scroll-py-1 overflow-x-hidden overflow-y-auto overscroll-contain outline-none data-empty:p-0',
        densityPad[density],
        className
      )}
      {...props}
    />
  );
}

function AutocompleteItem({
  className,
  variant: variantProp,
  density: densityProp,
  ...props
}: AutocompletePrimitive.Item.Props & {
  variant?: AutocompleteVariant;
  density?: AutocompleteDensity;
}) {
  const context = React.useContext(AutocompleteContext);
  const variant = variantProp ?? context.variant;
  const density = densityProp ?? context.density;
  const flushRadius = density === 'none';

  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      data-variant={variant}
      className={cn(
        'relative flex h-7 w-full cursor-default items-center gap-1.5 px-1.5 text-sm text-gray-950 outline-hidden select-none',
        flushRadius ? 'rounded-none' : 'rounded-(--menu-item-radius)',
        variant === 'solid'
          ? 'data-highlighted:bg-solid data-highlighted:text-on-solid data-highlighted:**:text-on-solid'
          : 'data-highlighted:bg-interactive data-highlighted:text-(--menu-item-highlight-text)',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function AutocompleteRow({ className, ...props }: AutocompletePrimitive.Row.Props) {
  return (
    <AutocompletePrimitive.Row data-slot="autocomplete-row" className={className} {...props} />
  );
}

function AutocompleteGroup({ className, ...props }: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn('scroll-my-1', className)}
      {...props}
    />
  );
}

function AutocompleteLabel({ className, ...props }: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-label"
      className={cn('px-1.5 py-1 text-xs text-muted', className)}
      {...props}
    />
  );
}

function AutocompleteSeparator({ className, ...props }: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-line', className)}
      {...props}
    />
  );
}

function AutocompleteEmpty({ className, ...props }: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn('px-2 py-3 text-center text-sm text-muted empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

function AutocompleteStatus({ className, ...props }: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn('px-2 py-1.5 text-xs text-muted empty:m-0 empty:p-0', className)}
      {...props}
    />
  );
}

const AutocompleteCollection = AutocompletePrimitive.Collection;

export {
  Autocomplete,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteIcon,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteRow,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  AutocompleteValue,
  autocompleteInputGroupVariants,
};
