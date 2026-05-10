import { Field, FieldLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaHero() {
  return (
    <Field name="bio" className="w-64">
      <FieldLabel>Bio</FieldLabel>
      <Textarea placeholder="Tell us about yourself." />
    </Field>
  );
}
