'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from '@phosphor-icons/react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { CheckboxGroupContext } from './checkbox-group';

type CheckboxTheme = 'gray' | 'accent';

/**
 * Slots: checkbox, checkbox-indicator
 */
const checkboxVariants = cva(
  'group/checkbox relative flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
  {
    variants: {
      variant: {
        solid:
          'border-line-ui bg-transparent text-ui-label data-checked:border-none data-checked:text-on-fill data-indeterminate:border-none data-indeterminate:text-on-fill',
        surface:
          'border-line-ui text-ui-label data-checked:text-secondary data-checked:data-[theme=gray]:text-primary data-indeterminate:text-secondary data-indeterminate:data-[theme="gray]:text-primary',
      },
      theme: {
        gray: '',
        accent: '',
      },
    },
    defaultVariants: {
      variant: 'solid',
      theme: 'gray',
    },
  }
);

function Checkbox({
  className,
  variant,
  theme,
  indeterminate,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, 'color'> &
  VariantProps<typeof checkboxVariants> & {
    indeterminate?: boolean;
  }) {
  const ctx = React.useContext(CheckboxGroupContext);
  const resolvedVariant = variant ?? ctx.variant ?? 'solid';
  const resolvedTheme = (theme ?? ctx.theme ?? 'gray') as CheckboxTheme;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-variant={resolvedVariant}
      data-theme={resolvedTheme !== 'gray' ? resolvedTheme : undefined}
      indeterminate={indeterminate}
      className={cn(
        checkboxVariants({ variant: resolvedVariant, theme: resolvedTheme }),
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        resolvedVariant === 'solid' &&
          'data-checked:focus-visible:outline-focus-fill data-indeterminate:focus-visible:outline-focus-fill',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current [&_svg]:size-3"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon weight="bold" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
export type { CheckboxTheme };
