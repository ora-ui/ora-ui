'use client';

import * as React from 'react';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';

import { cn } from '@/lib/utils';

interface CheckboxGroupContextValue {
  theme?: 'gray' | 'accent';
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue>({});

function CheckboxGroup({
  className,
  theme,
  ...props
}: CheckboxGroupPrimitive.Props & CheckboxGroupContextValue) {
  return (
    <CheckboxGroupContext.Provider value={{ theme }}>
      <CheckboxGroupPrimitive
        data-slot="checkbox-group"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  );
}

export { CheckboxGroup, CheckboxGroupContext };
