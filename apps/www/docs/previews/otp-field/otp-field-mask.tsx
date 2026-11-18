import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

export default function OtpFieldMask() {
  return (
    <Field name="code">
      <FieldLabel>Security PIN</FieldLabel>
      <OTPField length={6} mask defaultValue="482916">
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput key={index} />
        ))}
      </OTPField>
    </Field>
  );
}
