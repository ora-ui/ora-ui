'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl, CheckboxControl, TextControl } from './controls';
import { CHECKBOX_THEMES } from './constants';

type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

/* ---------- Checkbox Section ---------- */

export function CheckboxSection() {
  const [label, setLabel] = React.useState('Checkbox label');
  const [theme, setTheme] = React.useState<CheckboxTheme>('accent');
  const [disabled, setDisabled] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const preview = (
    <label className="flex items-center gap-2">
      <Checkbox theme={theme} disabled={disabled} indeterminate={indeterminate} defaultChecked />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );

  return (
    <ComponentDisplay
      name="Checkbox"
      slug="checkbox"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as CheckboxTheme)}
          />
          <ToolbarSeparator />
          <TextControl label="Label" value={label} onChange={setLabel} />
          <ToolbarSeparator />
          <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled} />
          <ToolbarSeparator />
          <CheckboxControl
            label="Indeterminate"
            checked={indeterminate}
            onChange={setIndeterminate}
          />
        </>
      }
    >
      <div className="flex justify-center">
        <div className="flex flex-col items-start gap-3">
          <label className="flex items-center gap-2">
            <Checkbox theme="accent" defaultChecked />
            <span className="text-sm text-foreground">Accept terms and conditions</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox theme="gray" defaultChecked />
            <span className="text-sm text-foreground">Subscribe to newsletter</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox />
            <span className="text-sm text-foreground">Remember this device</span>
          </label>
        </div>
      </div>
    </ComponentDisplay>
  );
}

/* ---------- Checkbox Group Section ---------- */

const NOTIFICATION_OPTIONS = [
  { value: 'email', label: 'Email updates' },
  { value: 'push', label: 'Push notifications' },
  { value: 'sms', label: 'SMS alerts' },
  { value: 'digest', label: 'Weekly digest' },
];

function GroupDemo({ theme }: { theme: CheckboxTheme }) {
  const [values, setValues] = React.useState(['email', 'push']);

  const allChecked = values.length === NOTIFICATION_OPTIONS.length;
  const someChecked = values.length > 0 && !allChecked;

  function handleParentChange() {
    setValues(allChecked ? [] : NOTIFICATION_OPTIONS.map((n) => n.value));
  }

  return (
    <CheckboxGroup
      value={values}
      onValueChange={setValues}
      allValues={NOTIFICATION_OPTIONS.map((n) => n.value)}
      theme={theme}
    >
      <label className="flex items-center gap-2">
        <Checkbox
          parent
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={handleParentChange}
        />
        <span className="text-sm font-medium text-foreground">All notifications</span>
      </label>

      <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
        {NOTIFICATION_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <Checkbox value={option.value} />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export function CheckboxGroupSection() {
  const [theme, setTheme] = React.useState<CheckboxTheme>('accent');

  return (
    <ComponentDisplay
      name="Checkbox Group"
      slug="checkbox-group"
      preview={<GroupDemo theme={theme} />}
      controls={
        <SelectControl
          label="Theme"
          value={theme}
          options={THEME_OPTIONS}
          onChange={(v) => setTheme(v as CheckboxTheme)}
        />
      }
    >
      <div className="flex justify-center">
        <GroupDemo theme="accent" />
      </div>
    </ComponentDisplay>
  );
}
