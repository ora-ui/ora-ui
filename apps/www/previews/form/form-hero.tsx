'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldError, FieldLabel, Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function FormHero() {
  return (
    <Form className="flex w-80 flex-col gap-5">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@company.com" />
        <FieldError />
      </Field>
      <Field name="password">
        <FieldLabel>Password</FieldLabel>
        <Input type="password" placeholder="••••••••" />
        <FieldDescription>Must be at least 8 characters.</FieldDescription>
        <FieldError />
      </Field>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-primary">
        <Checkbox name="remember" />
        Remember me for 30 days
      </label>
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </Form>
  );
}
