import { Field, FieldLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function InputHero() {
  return (
    <Field name="email" className="w-64">
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
    </Field>
  );
}
