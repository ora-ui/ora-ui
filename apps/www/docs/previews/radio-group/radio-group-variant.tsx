'use client';

import { RadioGroup, RadioGroupItem } from '@/registry/ui/radio-group';

export function RadioGroupSolid() {
  return (
    <RadioGroup defaultValue="a" className="w-48">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
        <RadioGroupItem value="a" />
        Option A
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
        <RadioGroupItem value="b" />
        Option B
      </label>
    </RadioGroup>
  );
}

export function RadioGroupSurface() {
  return (
    <RadioGroup defaultValue="a" className="w-48">
      <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
        <RadioGroupItem value="a" variant="surface" />
        Option A
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
        <RadioGroupItem value="b" variant="surface" />
        Option B
      </label>
    </RadioGroup>
  );
}

export default RadioGroupSolid;
