'use client';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
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

export default function ComboboxEmptyState() {
  return (
    <Combobox items={fruits} defaultInputValue="zzz">
      <ComboboxInputGroup className="w-64">
        <ComboboxInput aria-label="Fruit" placeholder="Select a fruit" />
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent>
        <ComboboxEmpty>No fruits match your search.</ComboboxEmpty>
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
