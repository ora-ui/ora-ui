'use client';

import { Button } from '@/registry/ui/button';
import { Field, FieldLabel, Form } from '@/registry/ui/form';
import { Input } from '@/registry/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/registry/ui/popover';

export default function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Rename project</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Rename project</PopoverTitle>
          <PopoverDescription>Pick a name your team will recognise.</PopoverDescription>
        </PopoverHeader>
        <Form onSubmit={(event) => event.preventDefault()}>
          <Field name="name">
            <FieldLabel>Project name</FieldLabel>
            <Input defaultValue="Website redesign" />
          </Field>
          <Button type="submit">Save</Button>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
