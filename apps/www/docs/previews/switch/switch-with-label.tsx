import { Field, FieldLabel } from '@/registry/ui/form';

import { Switch } from '@/registry/ui/switch';

export default function SwitchWithLabel() {
  return (
    <Field name="autosave" className="flex items-center justify-between gap-4 w-64">
      <FieldLabel>Auto-save</FieldLabel>
      <Switch defaultChecked />
    </Field>
  );
}
