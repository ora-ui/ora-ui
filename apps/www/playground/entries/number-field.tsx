import { Field, FieldError, FieldLabel } from '@/registry/ui/form';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';
import type { EntrySchema } from '@/playground/lib/types';

function toNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const numberFieldEntry: EntrySchema = {
  component: 'number-field',
  name: 'Number Field',
  variants: {
    variant: {
      values: ['surface', 'outline', 'soft'],
      label: 'Variant',
      default: 'surface',
    },
  },
  behavior: {
    showButtons: {
      type: 'boolean',
      label: 'Show buttons',
      default: true,
    },
    disabled: {
      type: 'boolean',
      label: 'Disabled',
      default: false,
    },
    invalid: {
      type: 'boolean',
      label: 'Invalid',
      default: false,
    },
  },
  content: {
    label: {
      type: 'string',
      label: 'Label',
      default: 'Quantity',
    },
    value: {
      type: 'string',
      label: 'Value',
      default: '1',
    },
    min: {
      type: 'string',
      label: 'Min',
      default: '',
    },
    max: {
      type: 'string',
      label: 'Max',
      default: '',
    },
    step: {
      type: 'string',
      label: 'Step',
      default: '1',
    },
  },
  render: function NumberFieldRender({ variants, behavior, inputs }) {
    const showButtons = behavior.showButtons === true;
    const invalid = behavior.invalid === true;

    return (
      <Field
        name="quantity"
        disabled={behavior.disabled === true}
        invalid={invalid}
        className="w-48"
      >
        <FieldLabel>{inputs.label as string}</FieldLabel>
        <NumberField
          key={String(inputs.value)}
          variant={variants.variant as 'surface' | 'outline' | 'soft'}
          defaultValue={toNumber(inputs.value)}
          min={toNumber(inputs.min)}
          max={toNumber(inputs.max)}
          step={toNumber(inputs.step)}
        >
          <NumberFieldGroup>
            {showButtons && <NumberFieldDecrement />}
            <NumberFieldInput />
            {showButtons && <NumberFieldIncrement />}
          </NumberFieldGroup>
        </NumberField>
        <FieldError match={invalid}>Enter a valid quantity.</FieldError>
      </Field>
    );
  },
};
