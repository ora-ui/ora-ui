import { Checkbox } from '@/registry/ui/checkbox';

export default function CheckboxDefault() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}
