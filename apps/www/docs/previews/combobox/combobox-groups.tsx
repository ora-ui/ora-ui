'use client';

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/registry/ui/combobox';

interface ProduceGroup {
  label: string;
  items: string[];
}

const produce: ProduceGroup[] = [
  { label: 'Fruits', items: ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'] },
  { label: 'Vegetables', items: ['Carrot', 'Celery', 'Kale', 'Spinach', 'Zucchini'] },
];

export default function ComboboxGroups() {
  return (
    <Combobox items={produce}>
      <ComboboxInputGroup className="w-64">
        <ComboboxInput aria-label="Produce" placeholder="Select produce" />
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent>
        <ComboboxEmpty>No produce found.</ComboboxEmpty>
        <ComboboxList>
          {(group: ProduceGroup, index: number) => (
            <div key={group.label}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxGroup items={group.items}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </div>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
