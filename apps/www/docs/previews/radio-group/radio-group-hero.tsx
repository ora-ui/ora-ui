'use client';

import { RadioGroup, RadioGroupItem } from '@/registry/ui/radio-group';

const OPTIONS = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
];

export default function RadioGroupHero() {
  return (
    <RadioGroup defaultValue="daily" className="w-64">
      {OPTIONS.map(({ value, label }) => (
        <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-primary">
          <RadioGroupItem value={value} />
          {label}
        </label>
      ))}
    </RadioGroup>
  );
}
