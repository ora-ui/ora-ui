import { Field, FieldLabel } from '@/registry/ui/form';
import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';

type Variant = 'surface' | 'outline' | 'soft';

function Slots({ variant }: { variant: Variant }) {
  return (
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <OTPField length={6} variant={variant}>
        {Array.from({ length: 6 }, (_, index) => (
          <OTPFieldInput key={index} />
        ))}
      </OTPField>
    </Field>
  );
}

export function OtpFieldSurface() {
  return <Slots variant="surface" />;
}

export function OtpFieldOutline() {
  return <Slots variant="outline" />;
}

export function OtpFieldSoft() {
  return <Slots variant="soft" />;
}

export default OtpFieldSurface;
