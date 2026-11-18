'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Menubar as MenubarPrimitive } from '@base-ui/react/menubar';
import { CheckIcon, CaretRightIcon as ChevronRightIcon } from '@phosphor-icons/react';

import { cn } from '@/registry/lib/utils';

type MenubarVariant = 'soft' | 'solid';
type MenubarTheme = 'gray' | 'accent' | (string & {});
type MenubarOrientation = 'horizontal' | 'vertical';

interface MenubarContextValue {
  variant: MenubarVariant;
  theme: MenubarTheme;
  orientation: MenubarOrientation;
}

const MenubarContext = React.createContext<MenubarContextValue>({
  variant: 'soft',
  theme: 'gray',
  orientation: 'horizontal',
});

const menuContentBaseStyles = [
  'z-50 max-h-(--available-height) min-w-40 max-w-96 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-overlay p-1 text-primary shadow-md ring-1 ring-line duration-100 outline-none',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
  'data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
] as const;

const menuItemBaseStyles = [
  'relative flex cursor-default items-center gap-1.5 rounded-(--menu-item-radius) px-3 py-0.75 text-sm text-gray-950 outline-hidden select-none',
  'data-inset:pl-7',
  'data-disabled:pointer-events-none data-disabled:opacity-50',
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
] as const;

const menuIndicatorItemBaseStyles =
  'relative flex cursor-default items-center gap-1.5 rounded-(--menu-item-radius) py-1 pr-8 pl-1.5 text-sm text-gray-950 outline-hidden select-none data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4';

function Menubar({
  className,
  variant = 'soft',
  theme = 'gray',
  orientation = 'horizontal',
  ...props
}: MenubarPrimitive.Props & {
  variant?: MenubarVariant;
  theme?: MenubarTheme;
}) {
  return (
    <MenubarContext.Provider value={{ variant, theme, orientation }}>
      <MenubarPrimitive
        data-slot="menubar"
        data-variant={variant}
        orientation={orientation}
        className={cn(
          'flex w-fit items-center gap-0.5 rounded-md border border-border bg-ui-subtle p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
          className
        )}
        {...props}
      />
    </MenubarContext.Provider>
  );
}
function MenubarMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}
function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  const { variant, theme } = React.useContext(MenubarContext);

  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      data-variant={variant}
      data-theme={theme !== 'gray' && variant === 'solid' ? theme : undefined}
      className={cn(
        'inline-flex h-7.5 shrink-0 items-center justify-start gap-1.5 rounded-(--menu-item-radius) px-3 text-sm font-medium whitespace-nowrap text-primary outline-none select-none hover:bg-interactive focus-visible:outline-2 focus-visible:outline-ring data-disabled:pointer-events-none data-disabled:opacity-50',
        variant === 'solid'
          ? 'data-popup-open:bg-solid data-popup-open:text-on-solid data-popup-open:hover:bg-solid'
          : 'data-popup-open:bg-interactive',
        className
      )}
      {...props}
    />
  );
}
function MenubarContent({
  align,
  alignOffset = 0,
  side,
  sideOffset = 4,
  variant,
  theme,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: MenubarVariant;
    theme?: MenubarTheme;
  }) {
  const root = React.useContext(MenubarContext);
  const resolvedVariant = variant ?? root.variant;
  const resolvedTheme = theme ?? root.theme;
  const vertical = root.orientation === 'vertical';

  return (
    <MenubarContext.Provider value={{ ...root, variant: resolvedVariant, theme: resolvedTheme }}>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner
          className="isolate z-50 outline-none"
          align={align ?? 'start'}
          alignOffset={alignOffset}
          side={side ?? (vertical ? 'right' : 'bottom')}
          sideOffset={sideOffset}
        >
          <MenuPrimitive.Popup
            data-slot="menubar-content"
            data-variant={resolvedVariant}
            data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
            className={cn(menuContentBaseStyles, className)}
            {...props}
          />
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenubarContext.Provider>
  );
}
function MenubarGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="menubar-group" {...props} />;
}
function MenubarLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="menubar-label"
      data-inset={inset}
      className={cn('px-1.5 py-1 text-xs text-secondary data-inset:pl-7', className)}
      {...props}
    />
  );
}
function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const { variant: menuVariant } = React.useContext(MenubarContext);
  const itemTheme = variant === 'destructive' ? 'destructive' : 'gray';

  return (
    <MenuPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      data-theme={itemTheme !== 'gray' ? itemTheme : undefined}
      className={cn(
        'group/menubar-item',
        menuItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-solid focus:text-on-solid focus:**:text-on-solid'
          : 'focus:bg-interactive focus:text-(--menu-item-highlight-text) focus:**:text-(--menu-item-highlight-text)',
        className
      )}
      {...props}
    />
  );
}
function MenubarCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(MenubarContext);

  return (
    <MenuPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      className={cn(
        menuIndicatorItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-solid focus:text-on-solid focus:**:text-on-solid'
          : 'focus:bg-interactive-strong focus:text-(--menu-item-highlight-text) focus:**:text-(--menu-item-highlight-text)',
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="menubar-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}
function MenubarRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />;
}
function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(MenubarContext);

  return (
    <MenuPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      className={cn(
        menuIndicatorItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-solid focus:text-on-solid focus:**:text-on-solid'
          : 'focus:bg-interactive-strong focus:text-(--menu-item-highlight-text) focus:**:text-(--menu-item-highlight-text)',
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="menubar-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}
function MenubarSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="menubar-sub" {...props} />;
}
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(MenubarContext);

  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        menuItemBaseStyles,
        menuVariant === 'solid'
          ? 'focus:bg-solid focus:text-on-solid data-popup-open:bg-solid data-popup-open:text-on-solid data-open:bg-solid data-open:text-on-solid'
          : 'focus:bg-interactive-strong focus:text-(--menu-item-highlight-text) data-popup-open:bg-interactive-strong data-popup-open:text-(--menu-item-highlight-text) data-open:bg-interactive-strong data-open:text-(--menu-item-highlight-text)',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="cn-rtl-flip ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}
function MenubarSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'right',
  sideOffset = 0,
  className,
  ...props
}: Omit<React.ComponentProps<typeof MenubarContent>, 'variant' | 'theme'>) {
  return (
    <MenubarContent
      data-slot="menubar-sub-content"
      className={cn('w-auto min-w-24', className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}
function MenubarSeparator({
  className,
  inset,
  ...props
}: MenuPrimitive.Separator.Props & {
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.Separator
      data-slot="menubar-separator"
      data-inset={inset}
      className={cn('-mx-1 my-1 h-px bg-line data-inset:mx-0', className)}
      {...props}
    />
  );
}
function MenubarShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        'ml-auto pl-4 text-xs tracking-widest text-secondary group-focus/menubar-item:text-inherit',
        className
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarLabel,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
