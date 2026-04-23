'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { RADIUS_PRESETS } from './constants';

export function GlobalControls() {
  const { theme, setTheme } = useTheme();
  const [radius, setRadius] = React.useState('0.375rem');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--radius', radius);
    return () => {
      document.documentElement.style.removeProperty('--radius');
    };
  }, [radius]);

  return (
    <div className="flex flex-col gap-4">
      {/* Theme toggle */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-foreground-subtle">Theme</Label>
        <ToggleGroup
          variant="outline"
          size="sm"
          spacing={0}
          value={mounted ? [theme === 'dark' ? 'dark' : 'light'] : []}
          onValueChange={(values) => {
            const next = values[0];
            if (next) setTheme(next);
          }}
        >
          <ToggleGroupItem value="light" aria-label="Light theme">
            <SunIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark theme">
            <MoonIcon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Radius presets */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-foreground-subtle">Radius</Label>
        <select
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="rounded-md border border-line bg-background px-2 py-1.5 text-xs text-foreground"
        >
          {RADIUS_PRESETS.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
