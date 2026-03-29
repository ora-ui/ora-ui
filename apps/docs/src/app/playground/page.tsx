'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/16/solid';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Toaster } from '@/components/ui/sonner';
import { BadgeSection } from './components/badge';
import { ButtonSection } from './components/button';
import { ButtonGroupSection } from './components/button-group';

const RADIUS_PRESETS = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '0.25rem' },
  { label: 'Medium', value: '0.375rem' },
  { label: 'Large', value: '0.625rem' },
  { label: 'Full', value: '9999px' },
] as const;

/* ---------- Floating Controls ---------- */

function FloatingControls() {
  const { theme, setTheme } = useTheme();
  const [radius, setRadius] = React.useState('0.375rem');

  React.useEffect(() => {
    document.documentElement.style.setProperty('--radius', radius);
    return () => {
      document.documentElement.style.removeProperty('--radius');
    };
  }, [radius]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Settings">
              <AdjustmentsHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme === 'dark' ? 'dark' : 'light'}
              onValueChange={setTheme}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Radius</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={radius} onValueChange={setRadius}>
              {RADIUS_PRESETS.map((preset) => (
                <DropdownMenuRadioItem key={preset.value} value={preset.value}>
                  {preset.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* ---------- Page ---------- */

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-16 px-6 py-12">
        <div>
          <h1 className="text-3xl font-bold">Playground</h1>
          <p className="mt-2 text-foreground-subtle">
            Overview of all component variants, sizes, and themes.
          </p>
        </div>

        <BadgeSection />
        <ButtonSection />
        <ButtonGroupSection />
      </div>

      <Toaster />
      <FloatingControls />
    </div>
  );
}
