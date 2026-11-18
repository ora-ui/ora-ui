import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from '@/registry/ui/menubar';
import type { EntrySchema } from '@/playground/lib/types';

export const menubarEntry: EntrySchema = {
  component: 'menubar',
  name: 'Menubar',
  variants: {
    variant: {
      values: ['soft', 'solid'],
      label: 'Variant',
      default: 'soft',
    },
    theme: {
      values: ['gray', 'accent'],
      label: 'Theme',
      default: 'gray',
    },
    orientation: {
      values: ['horizontal', 'vertical'],
      label: 'Orientation',
      default: 'horizontal',
    },
  },
  behavior: {
    modal: {
      values: ['true', 'false'],
      label: 'Modal',
      default: 'true',
    },
    loopFocus: {
      values: ['true', 'false'],
      label: 'Loop focus',
      default: 'true',
    },
  },
  content: {
    shortcuts: {
      type: 'boolean',
      label: 'Show shortcuts',
      default: false,
    },
    menus: {
      type: 'list',
      label: 'Menus',
      itemLabel: 'Menu',
      itemShape: {
        name: { type: 'string', label: 'Name', default: 'Menu' },
        items: { type: 'string', label: 'Items (comma separated)', default: 'Item' },
      },
      default: [
        { name: 'File', items: 'New file, Open..., Save' },
        { name: 'Edit', items: 'Undo, Redo, Find' },
        { name: 'View', items: 'Zoom in, Zoom out, Enter full screen' },
      ],
    },
  },
  render: function MenubarRender({ variants, behavior, inputs }) {
    const menus = inputs.menus as ReadonlyArray<Record<string, string>>;
    const shortcuts = inputs.shortcuts as boolean;
    const vertical = variants.orientation === 'vertical';

    return (
      <Menubar
        key={`${behavior.modal}-${behavior.loopFocus}-${variants.orientation}`}
        variant={variants.variant as 'soft' | 'solid'}
        theme={variants.theme as string}
        orientation={vertical ? 'vertical' : 'horizontal'}
        modal={behavior.modal === 'true'}
        loopFocus={behavior.loopFocus === 'true'}
      >
        {menus.map((menu, menuIndex) => (
          <MenubarMenu key={menuIndex}>
            <MenubarTrigger>{menu.name}</MenubarTrigger>
            <MenubarContent>
              {menu.items
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item, itemIndex) => (
                  <MenubarItem key={itemIndex}>
                    {item}
                    {shortcuts ? <MenubarShortcut>⌘{itemIndex + 1}</MenubarShortcut> : null}
                  </MenubarItem>
                ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    );
  },
};
