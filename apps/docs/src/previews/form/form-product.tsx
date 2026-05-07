'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Fieldset,
  FieldsetLegend,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const NOTIFICATION_OPTIONS = [
  { value: 'comments', label: 'New comments' },
  { value: 'mentions', label: 'Mentions & replies' },
  { value: 'updates', label: 'Product updates' },
];

const FREQUENCY_OPTIONS = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
];

export default function FormProduct() {
  return (
    <Form className="flex w-96 flex-col gap-8">
      <Fieldset>
        <FieldsetLegend>Profile</FieldsetLegend>
        <Field name="name">
          <FieldLabel>Display name</FieldLabel>
          <Input placeholder="Jane Smith" />
          <FieldError />
        </Field>
        <Field name="email">
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="jane@company.com" />
          <FieldDescription>Used for notifications and sign-in.</FieldDescription>
          <FieldError />
        </Field>
      </Fieldset>
      <Fieldset>
        <FieldsetLegend>Notifications</FieldsetLegend>
        {NOTIFICATION_OPTIONS.map(({ value, label }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 text-sm text-primary"
          >
            <Checkbox name={value} />
            {label}
          </label>
        ))}
      </Fieldset>
      <Fieldset>
        <FieldsetLegend>Delivery frequency</FieldsetLegend>
        <RadioGroup defaultValue="daily" className="gap-2">
          {FREQUENCY_OPTIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-primary"
            >
              <RadioGroupItem value={value} />
              {label}
            </label>
          ))}
        </RadioGroup>
      </Fieldset>
      <Button type="submit">Save changes</Button>
    </Form>
  );
}
