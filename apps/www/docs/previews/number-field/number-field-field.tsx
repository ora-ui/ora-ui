import { Field, FieldDescription, FieldError, FieldLabel } from '@/registry/ui/form';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';

export default function NumberFieldField() {
  return (
    <Field name="seats" invalid className="w-64">
      <FieldLabel>Seats</FieldLabel>
      <NumberField defaultValue={0} min={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <FieldDescription>Seats are billed per month.</FieldDescription>
      <FieldError match>Choose at least one seat.</FieldError>
    </Field>
  );
}
