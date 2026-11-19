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

function FruitCombobox({ variant }: { variant: 'soft' | 'solid' }) {
  return (
    <Combobox items={fruits} defaultValue="Apple">
      <ComboboxInputGroup className="w-64">
        <ComboboxInput aria-label="Fruit" placeholder="Select a fruit" />
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent variant={variant}>
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

export function ComboboxSoft() {
  return <FruitCombobox variant="soft" />;
}

export function ComboboxSolid() {
  return <FruitCombobox variant="solid" />;
}

export default ComboboxSoft;
