'use client';

import * as React from 'react';

import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldComplete() {
  const [code, setCode] = React.useState('');

  return (
    <div className="flex flex-col gap-3">
      <Field name="code">
        <FieldLabel>Verification code</FieldLabel>
        <OTPField length={6} onValueComplete={setCode}>
          {Array.from({ length: 6 }, (_, index) => (
            <OTPFieldInput key={index} />
          ))}
        </OTPField>
      </Field>
      <p className="text-sm text-secondary">
        {code ? `Code entered: ${code}` : 'Enter all six digits.'}
      </p>
    </div>
  );
}
