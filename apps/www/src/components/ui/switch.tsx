'use client';

import * as React from 'react';
import { Switch as SwitchPrimitive } from '@base-ui/react/switch';

import { cn } from '@/lib/utils';

type Theme = 'gray' | 'accent' | (string & {});

function Switch({
  className,
  size = 'default',
  theme = 'gray',
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default';
  theme?: Theme;
}) {
  const [internalChecked, setInternalChecked] = React.useState(checked ?? defaultChecked ?? false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-theme={theme !== 'gray' && isChecked ? theme : undefined}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(value, event) => {
        setInternalChecked(value);
        onCheckedChange?.(value, event);
      }}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-checked:focus-visible:outline-focus-fill aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-fill data-unchecked:bg-line data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] data-checked:bg-on-fill group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 data-unchecked:bg-background dark:data-unchecked:bg-primary"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
