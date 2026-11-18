import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';

export default function NumberFieldFormat() {
  return (
    <div className="w-48">
      <NumberField
        defaultValue={1200}
        locale="en-US"
        format={{ style: 'currency', currency: 'USD' }}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Price" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}
