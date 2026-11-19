'use client';

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/registry/ui/combobox';

const fruits = [
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

export default function ComboboxMultiple() {
  return (
    <Combobox items={fruits} multiple defaultValue={['Apple', 'Mango']}>
      <ComboboxInputGroup className="w-72">
        <ComboboxValue>
          {(value: string[]) => (
            <ComboboxChips>
              {value.map((fruit) => (
                <ComboboxChip key={fruit}>
                  {fruit}
                  <ComboboxChipRemove aria-label={`Remove ${fruit}`} />
                </ComboboxChip>
              ))}
              <ComboboxInput
                aria-label="Fruits"
                placeholder={value.length > 0 ? '' : 'Select fruits'}
                className="h-6 min-w-16 px-0"
              />
            </ComboboxChips>
          )}
        </ComboboxValue>
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent>
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
}
