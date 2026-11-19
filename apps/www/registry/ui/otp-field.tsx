'use client';

import * as React from 'react';
import { OTPField as OTPFieldPrimitive } from '@base-ui/react/otp-field';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/registry/lib/utils';
import { inputVariants } from '@/registry/ui/input';

type Variant = NonNullable<VariantProps<typeof inputVariants>['variant']>;

const OTPFieldContext = React.createContext<{ variant: Variant }>({ variant: 'surface' });

function OTPField({
  className,
  variant = 'surface',
  ...props
}: OTPFieldPrimitive.Root.Props & { variant?: Variant }) {
  const context = React.useMemo(() => ({ variant }), [variant]);

  return (
    <OTPFieldContext.Provider value={context}>
      <OTPFieldPrimitive.Root
        data-slot="otp-field"
        data-variant={variant}
        className={cn('flex gap-2', className)}
        {...props}
      />
    </OTPFieldContext.Provider>
  );
}

function OTPFieldInput({
  className,
  variant,
  ...props
}: OTPFieldPrimitive.Input.Props & { variant?: Variant }) {
  const context = React.useContext(OTPFieldContext);
  const resolved = variant ?? context.variant;

  return (
    <OTPFieldPrimitive.Input
      data-slot="otp-field-input"
      data-variant={resolved}
      className={cn(
        inputVariants({ variant: resolved }),
        'size-(--otp-slot-size,--spacing(10)) min-w-0 px-0 text-center tabular-nums transition-colors',
        className
      )}
      {...props}
    />
  );
}

function OTPFieldSeparator({ className, ...props }: OTPFieldPrimitive.Separator.Props) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="otp-field-separator"
      className={cn('h-px w-3 shrink-0 self-center bg-line', className)}
      {...props}
    />
  );
}

export { OTPField, OTPFieldInput, OTPFieldSeparator };
