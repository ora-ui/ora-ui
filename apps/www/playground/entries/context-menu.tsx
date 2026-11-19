import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/registry/ui/context-menu';
import type { EntrySchema, ListItem } from '@/playground/lib/types';

const SHORTCUTS = ['⌘O', 'F2', '⌘C', '⌫'];

export const contextMenuEntry: EntrySchema = {
  component: 'context-menu',
  name: 'Context Menu',
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
  },
  content: {
    items: {
      type: 'list',
      label: 'Items',
      itemLabel: 'Item',
      itemShape: {
        label: { type: 'string', label: 'Label', default: 'Open' },
        tone: {
          type: 'select',
          label: 'Tone',
          values: ['default', 'destructive'],
          default: 'default',
        },
      },
      default: [
        { label: 'Open', tone: 'default' },
        { label: 'Rename', tone: 'default' },
        { label: 'Copy', tone: 'default' },
        { label: 'Delete', tone: 'destructive' },
      ],
    },
    checkboxItems: {
      type: 'boolean',
      label: 'Show checkbox items',
      default: false,
    },
    radioItems: {
      type: 'boolean',
      label: 'Show radio items',
      default: false,
    },
    submenu: {
      type: 'boolean',
      label: 'Show submenu',
      default: false,
    },
    shortcuts: {
      type: 'boolean',
      label: 'Show shortcuts',
      default: false,
    },
  },
  render: function ContextMenuRender({ variants, inputs }) {
    const items = (inputs.items as ListItem[]) ?? [];
    const checkboxItems = inputs.checkboxItems as boolean;
    const radioItems = inputs.radioItems as boolean;
    const submenu = inputs.submenu as boolean;
    const shortcuts = inputs.shortcuts as boolean;

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[120px] w-[200px] items-center justify-center rounded-md border border-dashed border-border text-sm text-secondary select-none">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent
          variant={variants.variant as 'soft' | 'solid'}
          theme={variants.theme as string}
        >
          <ContextMenuGroup>
            {items.map((item, index) => (
              <ContextMenuItem
                key={index}
                variant={item.tone === 'destructive' ? 'destructive' : 'default'}
              >
                {item.label}
                {shortcuts && SHORTCUTS[index] ? (
                  <ContextMenuShortcut>{SHORTCUTS[index]}</ContextMenuShortcut>
                ) : null}
              </ContextMenuItem>
            ))}
          </ContextMenuGroup>
          {submenu ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>Email</ContextMenuItem>
                  <ContextMenuItem>Copy link</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </>
          ) : null}
          {checkboxItems ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem defaultChecked>Show hidden files</ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem>Show extensions</ContextMenuCheckboxItem>
            </>
          ) : null}
          {radioItems ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuRadioGroup defaultValue="name">
                <ContextMenuLabel>Sort by</ContextMenuLabel>
                <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
                <ContextMenuRadioItem value="date">Date modified</ContextMenuRadioItem>
                <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
