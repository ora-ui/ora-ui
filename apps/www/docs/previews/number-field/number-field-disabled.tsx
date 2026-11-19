import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';

export default function NumberFieldDisabled() {
  return (
    <div className="w-48">
      <NumberField disabled defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
