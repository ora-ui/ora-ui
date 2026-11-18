'use client';

import * as React from 'react';
import { NumberField as NumberFieldPrimitive } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from '@phosphor-icons/react';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { Button } from '@/registry/ui/button';
import { inputVariants } from '@/registry/ui/input';

type Variant = NonNullable<VariantProps<typeof inputVariants>['variant']>;

const NumberFieldContext = React.createContext<{ variant: Variant }>({ variant: 'surface' });

function NumberField({
  variant = 'surface',
  ...props
}: NumberFieldPrimitive.Root.Props & { variant?: Variant }) {
  const context = React.useMemo(() => ({ variant }), [variant]);

  return (
    <NumberFieldContext.Provider value={context}>
      <NumberFieldPrimitive.Root data-slot="number-field" data-variant={variant} {...props} />
    </NumberFieldContext.Provider>
  );
}

function NumberFieldGroup({
  className,
  variant,
  ...props
}: NumberFieldPrimitive.Group.Props & { variant?: Variant }) {
  const context = React.useContext(NumberFieldContext);
  const resolved = variant ?? context.variant;

  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      data-variant={resolved}
      className={cn(
        inputVariants({ variant: resolved }),
        'group/number-field-group flex items-stretch overflow-hidden px-0 transition-colors',
        'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50',
        'has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-ring/50',
        'has-[input[aria-invalid=true]]:border-destructive-700 has-[input[aria-invalid=true]]:outline-2 has-[input[aria-invalid=true]]:outline-destructive-700',
        'has-[input[aria-invalid=true]:focus-visible]:outline-3 has-[input[aria-invalid=true]:focus-visible]:outline-destructive-700',
        className
      )}
      {...props}
    />
  );
}

function NumberFieldInput({ className, ...props }: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        'h-full min-w-0 flex-1 bg-transparent px-3 text-center text-sm text-primary tabular-nums outline-none placeholder:text-secondary disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

const buttonClassName =
  'h-full w-8 shrink-0 rounded-none border-line-ui focus-visible:-outline-offset-2 group-has-[input:disabled]/number-field-group:disabled:opacity-100';

function NumberFieldDecrement({
  className,
  variant,
  children,
  ...props
}: NumberFieldPrimitive.Decrement.Props & { variant?: Variant }) {
  const context = React.useContext(NumberFieldContext);

  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      data-variant={variant ?? context.variant}
      aria-label="Decrease"
      render={<Button variant="ghost" size="icon" />}
      className={cn(buttonClassName, 'border-r', className)}
      {...props}
    >
      {children ?? <MinusIcon aria-hidden />}
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({
  className,
  variant,
  children,
  ...props
}: NumberFieldPrimitive.Increment.Props & { variant?: Variant }) {
  const context = React.useContext(NumberFieldContext);

  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      data-variant={variant ?? context.variant}
      aria-label="Increase"
      render={<Button variant="ghost" size="icon" />}
      className={cn(buttonClassName, 'border-l', className)}
      {...props}
    >
      {children ?? <PlusIcon aria-hidden />}
    </NumberFieldPrimitive.Increment>
  );
}

function NumberFieldScrubArea({ className, ...props }: NumberFieldPrimitive.ScrubArea.Props) {
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn('inline-block cursor-ew-resize text-sm font-medium text-primary', className)}
      {...props}
    />
  );
}

function NumberFieldScrubAreaCursor({
  className,
  children,
  ...props
}: NumberFieldPrimitive.ScrubAreaCursor.Props) {
  return (
    <NumberFieldPrimitive.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      className={cn('drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)]', className)}
      {...props}
    >
      {children ?? (
        <svg width="26" height="14" viewBox="0 0 24 14" fill="black" stroke="white" aria-hidden>
          <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
        </svg>
      )}
    </NumberFieldPrimitive.ScrubAreaCursor>
  );
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldScrubArea,
  NumberFieldScrubAreaCursor,
};
