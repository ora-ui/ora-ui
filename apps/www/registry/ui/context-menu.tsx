'use client';

import * as React from 'react';
import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';

import { cn } from '@/registry/lib/utils';
import { CheckIcon, CaretRightIcon as ChevronRightIcon } from '@phosphor-icons/react';

type ContextMenuVariant = 'soft' | 'solid';
type ContextMenuTheme = 'gray' | 'accent' | (string & {});

interface ContextMenuContextValue {
  variant: ContextMenuVariant;
  theme: ContextMenuTheme;
}

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  variant: 'soft',
  theme: 'gray',
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

function ContextMenu({ ...props }: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}
function ContextMenuTrigger({ ...props }: ContextMenuPrimitive.Trigger.Props) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />;
}
function ContextMenuContent({
  align,
  alignOffset,
  side,
  sideOffset,
  variant = 'soft',
  theme = 'gray',
  className,
  ...props
}: ContextMenuPrimitive.Popup.Props &
  Pick<ContextMenuPrimitive.Positioner.Props, 'align' | 'alignOffset' | 'side' | 'sideOffset'> & {
    variant?: ContextMenuVariant;
    theme?: ContextMenuTheme;
  }) {
  return (
    <ContextMenuContext.Provider value={{ variant, theme }}>
      <ContextMenuPrimitive.Portal>
        <ContextMenuPrimitive.Positioner
          className="isolate z-50 outline-none"
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
        >
          <ContextMenuPrimitive.Popup
            data-slot="context-menu-content"
            data-variant={variant}
            data-theme={theme !== 'gray' ? theme : undefined}
            className={cn(menuContentBaseStyles, className)}
            {...props}
          />
        </ContextMenuPrimitive.Positioner>
      </ContextMenuPrimitive.Portal>
    </ContextMenuContext.Provider>
  );
}
function ContextMenuGroup({ ...props }: ContextMenuPrimitive.Group.Props) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}
function ContextMenuLabel({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.GroupLabel.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.GroupLabel
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn('px-1.5 py-1 text-xs text-secondary data-inset:pl-7', className)}
      {...props}
    />
  );
}
function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: ContextMenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const { variant: menuVariant } = React.useContext(ContextMenuContext);
  const itemTheme = variant === 'destructive' ? 'destructive' : 'gray';

  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      data-theme={itemTheme !== 'gray' ? itemTheme : undefined}
      className={cn(
        'group/context-menu-item',
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
function ContextMenuSub({ ...props }: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(ContextMenuContext);

  return (
    <ContextMenuPrimitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
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
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}
function ContextMenuSubContent({
  align = 'start',
  alignOffset = -3,
  side = 'inline-end',
  sideOffset = 0,
  className,
  ...props
}: Omit<React.ComponentProps<typeof ContextMenuContent>, 'variant' | 'theme'>) {
  const { variant, theme } = React.useContext(ContextMenuContext);
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
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
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(ContextMenuContext);

  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
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
        data-slot="context-menu-checkbox-item-indicator"
      >
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}
function ContextMenuRadioGroup({ ...props }: ContextMenuPrimitive.RadioGroup.Props) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}
function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: ContextMenuPrimitive.RadioItem.Props & {
  inset?: boolean;
}) {
  const { variant: menuVariant } = React.useContext(ContextMenuContext);

  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
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
        data-slot="context-menu-radio-item-indicator"
      >
        <ContextMenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}
function ContextMenuSeparator({
  className,
  inset,
  ...props
}: ContextMenuPrimitive.Separator.Props & {
  inset?: boolean;
}) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      data-inset={inset}
      className={cn('-mx-1 my-1 h-px bg-line data-inset:mx-0', className)}
      {...props}
    />
  );
}
function ContextMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'ml-auto pl-4 text-xs tracking-widest text-secondary group-focus/context-menu-item:text-inherit',
        className
      )}
      {...props}
    />
  );
}
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
