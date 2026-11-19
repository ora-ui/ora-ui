import * as React from 'react';

import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
} from '@/registry/ui/number-field';

export default function NumberFieldScrub() {
  const id = React.useId();

  return (
    <NumberField defaultValue={1} className="flex w-48 flex-col gap-1.5">
      <NumberFieldScrubArea>
        <label htmlFor={id}>Quantity</label>
        <NumberFieldScrubAreaCursor />
      </NumberFieldScrubArea>
      <NumberFieldGroup>
        <NumberFieldInput id={id} />
      </NumberFieldGroup>
    </NumberField>
  );
}
