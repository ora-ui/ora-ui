'use client';

import * as React from 'react';
import { CheckboxGroup as CheckboxGroupPrimitive } from '@base-ui/react/checkbox-group';

import { cn } from '@/lib/utils';

interface CheckboxGroupContextValue {
  variant?: 'solid' | 'surface';
  theme?: 'gray' | 'accent';
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue>({});

/**
 * Slots: checkbox-group
 */
function CheckboxGroup({
  className,
  variant,
  theme,
  ...props
}: CheckboxGroupPrimitive.Props & CheckboxGroupContextValue) {
  return (
    <CheckboxGroupContext.Provider value={{ variant, theme }}>
      <CheckboxGroupPrimitive
        data-slot="checkbox-group"
        className={cn('flex flex-col gap-2', className)}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  );
}

export { CheckboxGroup, CheckboxGroupContext };
