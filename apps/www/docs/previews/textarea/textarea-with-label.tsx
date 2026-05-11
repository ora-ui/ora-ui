import { Field, FieldLabel } from '@/registry/ui/form';
import { Textarea } from '@/registry/ui/textarea';

export default function TextareaWithLabel() {
  return (
    <Field name="message" className="w-64">
      <FieldLabel>Message</FieldLabel>
      <Textarea placeholder="Write your message..." />
    </Field>
  );
}
