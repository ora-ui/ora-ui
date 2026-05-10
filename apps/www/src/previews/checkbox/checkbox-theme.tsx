import { Checkbox } from '@/components/ui/checkbox';

export function Gray() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox theme="gray" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export function Accent() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox theme="accent" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export default Gray;
