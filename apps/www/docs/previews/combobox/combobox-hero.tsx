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

export default function ComboboxHero() {
  return (
    <Combobox items={fruits}>
      <ComboboxInputGroup className="w-64">
        <ComboboxInput aria-label="Fruit" placeholder="Select a fruit" />
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
