import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxHero() {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2">
        <Checkbox defaultChecked />
        <span className="text-sm text-foreground">Checked</span>
      </label>
      <label className="flex items-center gap-2">
        <Checkbox />
        <span className="text-sm text-foreground">Unchecked</span>
      </label>
      <label className="flex items-center gap-2">
        <Checkbox indeterminate />
        <span className="text-sm text-foreground">Indeterminate</span>
      </label>
    </div>
  );
}
