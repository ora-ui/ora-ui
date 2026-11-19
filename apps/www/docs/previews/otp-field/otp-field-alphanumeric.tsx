'use client';

import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldAlphanumeric() {
  return (
    <Field name="code">
      <FieldLabel>Recovery code</FieldLabel>
      <OTPField
        length={6}
        validationType="alphanumeric"
        normalizeValue={(value) => value.toUpperCase()}
      >
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput key={index} />
        ))}
      </OTPField>
    </Field>
  );
}
