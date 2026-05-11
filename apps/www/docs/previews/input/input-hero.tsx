import { Field, FieldLabel } from '@/registry/ui/form';
import { Input } from '@/registry/ui/input';

export default function InputHero() {
  return (
    <Field name="email" className="w-64">
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
    </Field>
  );
}
