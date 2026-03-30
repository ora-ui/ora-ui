'use client';

import * as React from 'react';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';

import { cn } from '@/lib/utils';
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

const getDropdownThemeStyles = (
  theme: DropdownTheme,
  variant: DropdownVariant
): React.CSSProperties => {
  const isColor = theme !== 'gray';
  return {
    '--item-active-bg':
      variant === 'solid'
        ? isColor
          ? `var(--${theme}-700)`
          : 'var(--background-solid)'
        : isColor
          ? `var(--${theme}-a300)`
          : 'var(--hover)',
    '--item-active-text':
      variant === 'solid'
        ? isColor
          ? `var(--${theme}-foreground-solid)`
          : 'var(--foreground-solid)'
        : isColor
          ? `var(--${theme}-950)`
          : 'var(--foreground)',
  } as React.CSSProperties;
};

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
  style,
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
            data-theme={theme}
            className={cn(
              'z-50 max-h-(--available-height) w-(--anchor-width) min-w-40 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-background dark:bg-surface-2 p-1 text-foreground shadow-md ring-1 ring-line duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95',
              className
            )}
            style={{ ...getDropdownThemeStyles(theme, variant), ...style }}
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
        'px-1.5 py-1 text-xs font-medium text-foreground-subtle data-inset:pl-7',
        className
      )}
      {...props}
    />
  );
}
function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  style,
  ...props
}: MenuPrimitive.Item.Props & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  const { variant: menuVariant } = React.useContext(DropdownMenuContext);
  const isDestructive = variant === 'destructive';

  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      style={
        {
          ...(isDestructive && {
            '--item-active-text': menuVariant === 'solid' ? 'white' : 'var(--destructive-800)',
          }),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-2 py-1.5 pr-3 text-sm outline-hidden select-none',
        'not-data-[variant=destructive]:focus:bg-(--item-active-bg)',
        'focus:text-(--item-active-text) focus:**:text-(--item-active-text)',
        'data-inset:pl-7',
        isDestructive && menuVariant === 'solid'
          ? 'data-[variant=destructive]:focus:bg-destructive-700'
          : 'data-[variant=destructive]:focus:bg-hover',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
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
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-(--item-active-bg) focus:text-(--item-active-text) not-data-[variant=destructive]:focus:**:text-(--item-active-text) data-inset:pl-7 data-popup-open:bg-(--item-active-bg) data-popup-open:text-(--item-active-text) data-open:bg-(--item-active-bg) data-open:text-(--item-active-text) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
      className={cn(
        'w-auto min-w-24 rounded-lg bg-background dark:bg-surface-2 p-1 text-foreground shadow-lg ring-1 ring-line duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className
      )}
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
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-(--item-active-bg) focus:text-(--item-active-text) focus:**:text-(--item-active-text) data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-(--item-active-bg) focus:text-(--item-active-text) focus:**:text-(--item-active-text) data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        'ml-auto pl-4 text-xs tracking-widest text-foreground-subtle group-focus/dropdown-menu-item:text-(--item-active-text)',
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
