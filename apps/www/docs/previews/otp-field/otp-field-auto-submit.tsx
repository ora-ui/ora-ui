'use client';

import * as React from 'react';

import { Field, FieldLabel, Form } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldAutoSubmit() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <Form
      className="flex flex-col gap-3"
      onFormSubmit={(values) => setSubmitted(String(values.code))}
    >
      <Field name="code">
        <FieldLabel>Verification code</FieldLabel>
        <OTPField length={6} autoSubmit>
          {Array.from({ length: 6 }, (_, index) => (
            <OTPFieldInput key={index} />
          ))}
        </OTPField>
      </Field>
      <p className="text-sm text-secondary">
        {submitted ? `Verified ${submitted}` : 'The form submits on the last digit.'}
      </p>
    </Form>
  );
}
