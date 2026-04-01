'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ToolbarGroup } from '@/components/ui/toolbar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TextControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextControl({ label, value, onChange }: TextControlProps) {
  return (
    <ToolbarGroup className="gap-2">
      <Label className="text-xs font-normal text-foreground-subtle">{label}</Label>
      <Input
        variant="soft"
        className="h-7 w-28 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.stopPropagation();
          }
        }}
      />
    </ToolbarGroup>
  );
}

interface SelectControlProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export function SelectControl({ label, value, options, onChange }: SelectControlProps) {
  return (
    <ToolbarGroup className="gap-2">
      <Label className="text-xs font-normal text-foreground-subtle">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-line bg-background px-2 py-1 text-xs text-foreground"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </ToolbarGroup>
  );
}

interface CheckboxControlProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxControl({ label, checked, disabled, onChange }: CheckboxControlProps) {
  return (
    <ToolbarGroup className="gap-2">
      <label
        className={cn(
          'flex items-center gap-1.5 text-xs',
          disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-foreground"
        />
        <span className="text-foreground-subtle">{label}</span>
      </label>
    </ToolbarGroup>
  );
}

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  label: string;
  value: string;
  options: SegmentedControlOption[];
  onChange: (value: string) => void;
}

export function SegmentedControl({ label, value, options, onChange }: SegmentedControlProps) {
  return (
    <ToolbarGroup className="gap-2">
      <Label className="text-xs font-normal text-foreground-subtle">{label}</Label>
      <ToggleGroup
        variant="outline"
        size="sm"
        spacing={0}
        value={[value]}
        onValueChange={(values) => {
          const next = values[0];
          if (next) onChange(next);
        }}
      >
        {options.map((opt) => (
          <ToggleGroupItem key={opt.value} value={opt.value}>
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </ToolbarGroup>
  );
}
