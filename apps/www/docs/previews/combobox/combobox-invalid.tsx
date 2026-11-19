'use client';

import { Field, FieldError, FieldLabel } from '@/registry/ui/form';
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

export default function ComboboxInvalid() {
  return (
    <Field name="fruit" invalid className="w-64">
      <FieldLabel>Favourite fruit</FieldLabel>
      <Combobox items={fruits}>
        <ComboboxInputGroup>
          <ComboboxInput placeholder="Select a fruit" />
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
      <FieldError match>Pick a fruit to continue.</FieldError>
    </Field>
  );
}
