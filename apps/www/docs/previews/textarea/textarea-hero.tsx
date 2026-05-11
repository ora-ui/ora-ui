import { Field, FieldLabel } from '@/registry/ui/form';
import { Textarea } from '@/registry/ui/textarea';

export default function TextareaHero() {
  return (
    <Field name="bio" className="w-64">
      <FieldLabel>Bio</FieldLabel>
      <Textarea placeholder="Tell us about yourself." />
    </Field>
  );
}
