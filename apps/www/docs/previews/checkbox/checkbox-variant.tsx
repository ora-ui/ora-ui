import { Checkbox } from '@/registry/ui/checkbox';

export function CheckboxSolid() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox variant="solid" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export function CheckboxSurface() {
  return (
    <label className="flex items-center gap-2">
      <Checkbox variant="surface" defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );
}

export default CheckboxSolid;
