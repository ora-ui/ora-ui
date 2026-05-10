import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';

const PREFERENCES = [
  { value: 'acoustic', label: 'Acoustic' },
  { value: 'instrumental', label: 'Instrumental' },
  { value: 'live', label: 'Live recordings' },
];

export default function CheckboxGroupDefault() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Sound preferences</p>
      <CheckboxGroup defaultValue={['acoustic']}>
        {PREFERENCES.map((pref) => (
          <label key={pref.value} className="flex items-center gap-2">
            <Checkbox value={pref.value} />
            <span className="text-sm text-foreground">{pref.label}</span>
          </label>
        ))}
      </CheckboxGroup>
    </div>
  );
}
