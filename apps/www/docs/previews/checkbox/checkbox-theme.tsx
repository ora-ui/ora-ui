import { Checkbox } from '@/registry/ui/checkbox';

export function CheckboxGray() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox theme="gray" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export function CheckboxAccent() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox theme="accent" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export default CheckboxGray;
