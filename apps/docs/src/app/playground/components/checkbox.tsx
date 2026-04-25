'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl, CheckboxControl, TextControl } from './controls';
import { CHECKBOX_VARIANTS, CHECKBOX_THEMES } from './constants';

type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];
type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const VARIANT_OPTIONS = CHECKBOX_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

/* ---------- Checkbox Section ---------- */

export function CheckboxSection() {
  const [label, setLabel] = React.useState('Checkbox label');
  const [variant, setVariant] = React.useState<CheckboxVariant>('solid');
  const [theme, setTheme] = React.useState<CheckboxTheme>('gray');
  const [disabled, setDisabled] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const preview = (
    <label className="flex items-center gap-2">
      <Checkbox
        variant={variant}
        theme={theme}
        disabled={disabled}
        indeterminate={indeterminate}
        defaultChecked
      />
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
            label="Variant"
            value={variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setVariant(v as CheckboxVariant)}
          />
          <ToolbarSeparator />
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
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-secondary">Solid variant</span>
            <label className="flex items-center gap-2">
              <Checkbox variant="solid" theme="gray" defaultChecked />
              <span className="text-sm text-foreground">Gray theme</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox variant="solid" theme="accent" defaultChecked />
              <span className="text-sm text-foreground">Accent theme</span>
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-secondary">Surface variant</span>
            <label className="flex items-center gap-2">
              <Checkbox variant="surface" theme="gray" defaultChecked />
              <span className="text-sm text-foreground">Gray theme</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox variant="surface" theme="accent" defaultChecked />
              <span className="text-sm text-foreground">Accent theme</span>
            </label>
          </div>
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
  const [theme, setTheme] = React.useState<CheckboxTheme>('gray');

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
        <GroupDemo theme="gray" />
      </div>
    </ComponentDisplay>
  );
}
