'use client';

import * as React from 'react';
import { Checkbox } from '@/registry/ui/checkbox';
import { CheckboxGroup } from '@/registry/ui/checkbox-group';

const OPTIONS = [
  { value: 'email', label: 'Email updates' },
  { value: 'push', label: 'Push notifications' },
  { value: 'sms', label: 'SMS alerts' },
];

export default function CheckboxIndeterminate() {
  const [values, setValues] = React.useState(['email']);

  const allChecked = values.length === OPTIONS.length;
  const someChecked = values.length > 0 && !allChecked;

  return (
    <CheckboxGroup value={values} onValueChange={setValues} allValues={OPTIONS.map((o) => o.value)}>
      <label className="flex items-center gap-2">
        <Checkbox
          parent
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={() => setValues(allChecked ? [] : OPTIONS.map((o) => o.value))}
        />
        <span className="text-sm text-foreground">All notifications</span>
      </label>
      <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
        {OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <Checkbox value={option.value} />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </CheckboxGroup>
  );
}
