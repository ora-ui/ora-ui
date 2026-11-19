import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/registry/ui/combobox';
import type { EntrySchema } from '@/playground/lib/types';

const FRUITS = [
  'Apple',
  'Banana',
  'Cherry',
  'Grape',
  'Kiwi',
  'Mango',
  'Orange',
  'Peach',
  'Pear',
  'Strawberry',
];

export const comboboxEntry: EntrySchema = {
  component: 'combobox',
  name: 'Combobox',
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
    density: {
      values: ['none', 'compact', 'comfortable'],
      label: 'Density',
      default: 'comfortable',
    },
  },
  behavior: {
    multiple: { type: 'boolean', label: 'Multiple', default: false },
    showClear: { type: 'boolean', label: 'Show clear', default: true },
    showTrigger: { type: 'boolean', label: 'Show trigger', default: true },
    disabled: { type: 'boolean', label: 'Disabled', default: false },
    invalid: { type: 'boolean', label: 'Invalid', default: false },
  },
  content: {
    items: {
      type: 'list',
      label: 'Items',
      itemLabel: 'Item',
      itemShape: {
        label: { type: 'string', label: 'Label', default: 'Fruit' },
      },
      default: FRUITS.map((label) => ({ label })),
    },
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      default: 'Select a fruit',
    },
  },
  render: function ComboboxRender({ variants, behavior, inputs }) {
    const variant = variants.variant as 'soft' | 'solid';
    const theme = variants.theme as string;
    const density = variants.density as 'none' | 'compact' | 'comfortable';
    const multiple = behavior.multiple === true;
    const showClear = behavior.showClear === true;
    const showTrigger = behavior.showTrigger === true;
    const disabled = behavior.disabled === true;
    const invalid = behavior.invalid === true;
    const placeholder = inputs.placeholder as string;
    const items = (inputs.items as { label: string }[]).map((item) => item.label);

    const controls = (
      <>
        {showClear && <ComboboxClear />}
        {showTrigger && <ComboboxTrigger />}
      </>
    );

    return (
      <Combobox
        key={multiple ? 'multi' : 'single'}
        items={items}
        multiple={multiple}
        disabled={disabled}
      >
        <ComboboxInputGroup className="w-72">
          {multiple ? (
            <ComboboxValue>
              {(value: string[]) => (
                <ComboboxChips>
                  {value.map((item) => (
                    <ComboboxChip key={item}>
                      {item}
                      <ComboboxChipRemove aria-label={`Remove ${item}`} />
                    </ComboboxChip>
                  ))}
                  <ComboboxInput
                    aria-label="Fruit"
                    aria-invalid={invalid || undefined}
                    placeholder={value.length > 0 ? '' : placeholder}
                    className="h-6 min-w-12 px-0"
                  />
                </ComboboxChips>
              )}
            </ComboboxValue>
          ) : (
            <ComboboxInput
              aria-label="Fruit"
              aria-invalid={invalid || undefined}
              placeholder={placeholder}
            />
          )}
          {controls}
        </ComboboxInputGroup>
        <ComboboxContent variant={variant} theme={theme} density={density}>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};
