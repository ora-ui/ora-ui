import { Field, FieldDescription, FieldError, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldField() {
  return (
    <Field name="code" invalid>
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={6} defaultValue="123456">
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput key={index} />
        ))}
      </OTPField>
      <FieldDescription>We sent a 6 digit code to your phone.</FieldDescription>
      <FieldError match>That code has expired. Request a new one.</FieldError>
    </Field>
  );
}
