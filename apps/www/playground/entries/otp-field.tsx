import { OTPField, OTPFieldInput } from '@/registry/ui/otp-field';
import { Field, FieldLabel } from '@/registry/ui/form';
import type { EntrySchema } from '@/playground/lib/types';

type ValidationType = 'numeric' | 'alpha' | 'alphanumeric' | 'none';

export const otpFieldEntry: EntrySchema = {
  component: 'otp-field',
  name: 'OTP Field',
  variants: {
    variant: {
      values: ['surface', 'outline', 'soft'],
      label: 'Variant',
      default: 'surface',
    },
  },
  behavior: {
    length: {
      values: ['4', '5', '6', '7', '8'],
      label: 'Length',
      default: '6',
    },
    validationType: {
      label: 'Validation type',
      values: ['numeric', 'alpha', 'alphanumeric', 'none'],
      default: 'numeric',
    },
    mask: { type: 'boolean', label: 'Mask', default: false },
    disabled: { type: 'boolean', label: 'Disabled', default: false },
    invalid: { type: 'boolean', label: 'Invalid', default: false },
  },
  content: {
    label: {
      type: 'string',
      label: 'Label',
      default: 'Verification code',
    },
  },
  render: function OTPFieldRender({ variants, behavior, inputs }) {
    const length = Number(behavior.length);

    return (
      <Field
        name="code"
        disabled={behavior.disabled as boolean}
        invalid={behavior.invalid as boolean}
      >
        <FieldLabel>{inputs.label as string}</FieldLabel>
        <OTPField
          key={`${length}-${behavior.validationType}`}
          length={length}
          variant={variants.variant as 'surface' | 'outline' | 'soft'}
          validationType={behavior.validationType as ValidationType}
          mask={behavior.mask as boolean}
        >
          {Array.from({ length }, (_, index) => (
            <OTPFieldInput key={index} />
          ))}
        </OTPField>
      </Field>
    );
  },
};
