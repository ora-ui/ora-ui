'use client';

import * as React from 'react';
import { Checkbox } from '@/registry/ui/checkbox';
import { CheckboxGroup } from '@/registry/ui/checkbox-group';

const GENRES = [
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Classical' },
  { value: 'blues', label: 'Blues' },
];

export default function CheckboxGroupParent() {
  const [values, setValues] = React.useState<string[]>(['jazz']);

  const allChecked = values.length === GENRES.length;
  const someChecked = values.length > 0 && !allChecked;

  return (
    <CheckboxGroup
      value={values}
      onValueChange={setValues}
      allValues={GENRES.map((g) => g.value)}
      className="gap-3"
    >
      <label className="flex items-center gap-2">
        <Checkbox
          parent
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={() => setValues(allChecked ? [] : GENRES.map((g) => g.value))}
        />
        <span className="text-sm font-medium text-foreground">All genres</span>
      </label>
      <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
        {GENRES.map((genre) => (
          <label key={genre.value} className="flex items-center gap-2">
            <Checkbox value={genre.value} />
            <span className="text-sm text-foreground">{genre.label}</span>
          </label>
        ))}
      </div>
    </CheckboxGroup>
  );
}
