'use client';

import * as React from 'react';
import { Checkbox } from '@/registry/ui/checkbox';
import { CheckboxGroup } from '@/registry/ui/checkbox-group';

const ELECTRONIC = [
  { value: 'house', label: 'House' },
  { value: 'techno', label: 'Techno' },
  { value: 'ambient', label: 'Ambient' },
];

const ALL_VALUES = [...ELECTRONIC.map((i) => i.value), 'pop', 'jazz'];

export default function CheckboxGroupNested() {
  const [values, setValues] = React.useState<string[]>(['house', 'pop']);

  const allChecked = values.length === ALL_VALUES.length;
  const someChecked = values.length > 0 && !allChecked;

  const allElectronicChecked = ELECTRONIC.every((i) => values.includes(i.value));
  const someElectronicChecked =
    ELECTRONIC.some((i) => values.includes(i.value)) && !allElectronicChecked;

  return (
    <CheckboxGroup
      value={values}
      onValueChange={setValues}
      allValues={ALL_VALUES}
      className="gap-3"
    >
      <label className="flex items-center gap-2">
        <Checkbox
          parent
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={() => setValues(allChecked ? [] : ALL_VALUES)}
        />
        <span className="text-sm font-medium text-foreground">All genres</span>
      </label>
      <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
        <label className="flex items-center gap-2">
          <Checkbox value="pop" />
          <span className="text-sm text-foreground">Pop</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox value="jazz" />
          <span className="text-sm text-foreground">Jazz</span>
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={allElectronicChecked}
              indeterminate={someElectronicChecked}
              onCheckedChange={() =>
                setValues((prev) =>
                  allElectronicChecked
                    ? prev.filter((v) => !ELECTRONIC.map((i) => i.value).includes(v))
                    : [...new Set([...prev, ...ELECTRONIC.map((i) => i.value)])]
                )
              }
            />
            <span className="text-sm font-medium text-foreground">Electronic</span>
          </label>
          <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
            {ELECTRONIC.map((item) => (
              <label key={item.value} className="flex items-center gap-2">
                <Checkbox value={item.value} />
                <span className="text-sm text-foreground">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </CheckboxGroup>
  );
}
