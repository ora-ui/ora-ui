'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { CheckIcon, MinusIcon } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';
import { CheckboxGroupContext } from './checkbox-group';

type Theme = 'gray' | 'accent' | (string & {});

const getThemeStyles = (theme: Theme): React.CSSProperties => {
  const isColor = theme !== 'gray';
  return {
    '--background-solid': isColor ? `var(--${theme}-700)` : `var(--${theme}-950)`,
    '--focus': `var(--${theme}-500)`,
    '--focus-solid': isColor ? `var(--${theme}-800)` : `var(--${theme}-950)`,
    ...(isColor ? { '--foreground-solid': `var(--${theme}-foreground-solid)` } : {}),
  } as React.CSSProperties;
};

type CheckboxTheme = 'gray' | 'accent';

function Checkbox({
  className,
  theme,
  indeterminate,
  style,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, 'color'> & {
  theme?: CheckboxTheme;
  indeterminate?: boolean;
}) {
  const ctx = React.useContext(CheckboxGroupContext);
  const resolvedTheme = (theme ?? ctx.theme ?? 'accent') as CheckboxTheme;

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-theme={resolvedTheme}
      indeterminate={indeterminate}
      className={cn(
        'group/checkbox relative flex size-4 shrink-0 items-center justify-center rounded-sm border border-line-ui/65 bg-transparent transition-colors',
        'data-checked:border-transparent data-checked:bg-background-solid data-checked:text-foreground-solid',
        'data-indeterminate:border-transparent data-indeterminate:bg-background-solid data-indeterminate:text-foreground-solid',
        'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        'data-checked:focus-visible:outline-focus-solid data-indeterminate:focus-visible:outline-focus-solid',
        resolvedTheme === 'gray' && 'data-checked:text-gray-50 data-indeterminate:text-gray-50',
        className
      )}
      style={{ ...getThemeStyles(resolvedTheme), ...style }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current [&_svg]:size-3"
      >
        {indeterminate ? <MinusIcon /> : <CheckIcon />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
export type { CheckboxTheme };
