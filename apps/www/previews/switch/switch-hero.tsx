'use client';

import { Switch } from '@/registry/ui/switch';

const SETTINGS = [
  { id: 'email', label: 'Email notifications', defaultChecked: true },
  { id: 'push', label: 'Push notifications', defaultChecked: true },
  { id: 'marketing', label: 'Marketing emails', defaultChecked: false },
];

export default function SwitchHero() {
  return (
    <div className="w-72 space-y-4">
      {SETTINGS.map(({ id, label, defaultChecked }) => (
        <div key={id} className="flex items-center justify-between">
          <span className="text-sm text-foreground">{label}</span>
          <Switch defaultChecked={defaultChecked} />
        </div>
      ))}
    </div>
  );
}
