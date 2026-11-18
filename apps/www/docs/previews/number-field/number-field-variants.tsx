import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/registry/ui/number-field';

export function NumberFieldSurface() {
  return (
    <div className="w-48">
      <NumberField variant="surface" defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}

export function NumberFieldOutline() {
  return (
    <div className="w-48">
      <NumberField variant="outline" defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}

export function NumberFieldSoft() {
  return (
    <div className="w-48">
      <NumberField variant="soft" defaultValue={1}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Quantity" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  );
}

export default NumberFieldSurface;
