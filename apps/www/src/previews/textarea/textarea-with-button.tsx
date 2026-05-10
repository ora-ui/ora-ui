import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaWithButton() {
  return (
    <Field name="comment" className="flex w-64 flex-col gap-2">
      <FieldLabel>Comment</FieldLabel>
      <Textarea placeholder="Leave a comment..." />
      <Button className="self-end">Submit</Button>
    </Field>
  );
}
