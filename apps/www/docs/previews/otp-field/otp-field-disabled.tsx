import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldDisabled() {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={6} disabled>
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput key={index} />
        ))}
      </OTPField>
    </Field>
  );
}
