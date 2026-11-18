import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput, OTPFieldSeparator } from '@/registry/ui/otp-field';

export default function OtpFieldGrouped() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={6}>
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldSeparator />
        <OTPFieldInput />
        <OTPFieldInput />
        <OTPFieldInput />
      </OTPField>
    </Field>
  );
}
