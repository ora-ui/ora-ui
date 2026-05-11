'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';

import { cn } from '@/registry/lib/utils';
import { CheckIcon, CaretRightIcon as ChevronRightIcon } from '@phosphor-icons/react';

type DropdownVariant = 'soft' | 'solid';
type DropdownTheme = 'gray' | 'accent';

interface DropdownMenuContextValue {
  variant: DropdownVariant;
  theme: DropdownTheme;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  variant: 'soft',
  theme: 'gray',
});

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}
function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}
function DropdownMenuContent({
  align = 'start',
  alignOffset = 0,
  side = 'bottom',
  sideOffset = 4,
  variant = 'soft',
  theme = 'gray',
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: DropdownVariant;
    theme?: DropdownTheme;
  }) {
  return (
    <DropdownMenuContext.Provider value={{ variant, theme }}>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          className="isolate z-50 outline-none"
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <MenuPrimitive.Popup
            data-slot="dropdown-menu-content"
            data-variant={variant}
            data-theme={theme !== 'gray' ? theme : undefined}
            className={cn(menuContentBaseStyles, className)}
            {...props}
          />
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </DropdownMenuContext.Provider>
  );
}
function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        'px-1.5 py-1 text-xs font-medium text-(--menu-item-text-muted) data-inset:pl-7',
        className
      )}
      {...props}
    />
  );
}
const menuContentBaseStyles = [
  'z-50 max-h-(--available-height) min-w-40 max-w-96 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-overlay p-1 text-primary shadow-md ring-1 ring-line duration-100 outline-none',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
] as const;

const menuItemBaseStyles = [
  'relative flex cursor-default items-center gap-1.5 rounded-(--menu-item-radius) px-3 py-0.75 text-sm text-[var(--menu-item-text)] outline-hidden select-none',
  'data-inset:pl-7',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
] as const;

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const { variant: menuVariant } = React.useContext(DropdownMenuContext);

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-theme={variant === 'destructive' ? 'destructive' : undefined}
      className={cn(
        'group/dropdown-menu-item',
        menuItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-fill focus:text-on-fill focus:**:text-on-fill'
          : 'focus:bg-hover  focus:text-(--menu-item-text) focus:**:text-(--menu-item-text)',
        className
      )}
      {...props}
    />
  );
}
function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(DropdownMenuContext);

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        menuItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-fill focus:text-on-fill data-popup-open:bg-fill data-popup-open:text-on-fill data-open:bg-fill data-open:text-on-fill'
          : 'focus:bg-active focus:text-(--menu-item-text) data-popup-open:bg-active data-popup-open:text-(--menu-item-text) data-open:bg-active data-open:text-(--menu-item-text)',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="cn-rtl-flip ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}
function DropdownMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: Omit<React.ComponentProps<typeof DropdownMenuContent>, 'variant' | 'theme'>) {
  const { variant, theme } = React.useContext(DropdownMenuContext);
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      variant={variant}
      theme={theme}
      className={cn('w-auto min-w-24', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(DropdownMenuContext);

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        'relative flex cursor-default items-center gap-1.5 rounded-(--menu-item-radius) py-1 pr-8 pl-1.5 text-sm text-(--menu-item-text) outline-hidden select-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        menuVariant === 'solid'
          ? 'focus:bg-fill focus:text-on-fill focus:**:text-on-fill'
          : 'focus:bg-active focus:text-(--menu-item-text) focus:**:text-(--menu-item-text)',
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}
function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}
function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(DropdownMenuContext);

  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        'relative flex cursor-default items-center gap-1.5 rounded-(--menu-item-radius) py-1 pr-8 pl-1.5 text-sm text-(--menu-item-text) outline-hidden select-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        menuVariant === 'solid'
          ? 'focus:bg-fill focus:text-on-fill focus:**:text-on-fill'
          : 'focus:bg-active focus:text-(--menu-item-text) focus:**:text-(--menu-item-text)',
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}
function DropdownMenuSeparator({
  className,
  inset,
  ...props
}: MenuPrimitive.Separator.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      data-inset={inset}
      className={cn('-mx-1 my-1 h-px bg-line data-inset:mx-0', className)}
      {...props}
    />
  );
}
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        'ml-auto pl-4 text-xs tracking-widest text-(--menu-item-text-secondary) group-focus/dropdown-menu-item:text-inherit',
        className
      )}
      {...props}
    />
  );
}
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
