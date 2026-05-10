import { Checkbox } from '@/components/ui/checkbox';

export function Solid() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox variant="solid" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export function Surface() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox variant="surface" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export default Solid;
