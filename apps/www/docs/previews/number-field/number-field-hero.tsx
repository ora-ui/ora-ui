import { Field, FieldLabel } from '@/registry/ui/form';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';

export default function NumberFieldHero() {
  return (
    <Field name="quantity" className="w-48">
      <FieldLabel>Quantity</FieldLabel>
      <NumberField defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </Field>
  );
}
