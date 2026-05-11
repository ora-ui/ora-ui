'use client';

import * as React from 'react';
import { Checkbox } from '@/registry/ui/checkbox';
import { CheckboxGroup } from '@/registry/ui/checkbox-group';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { PreviewShell } from '@/playground/components/preview-shell';
import { SelectControl } from '@/playground/components/controls';
import { CHECKBOX_VARIANTS, CHECKBOX_THEMES } from '@/playground/components/constants';

type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];
type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const VARIANT_OPTIONS = CHECKBOX_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

const NOTIFICATION_OPTIONS = [
  { value: 'email', label: 'Email updates' },
  { value: 'push', label: 'Push notifications' },
  { value: 'sms', label: 'SMS alerts' },
  { value: 'digest', label: 'Weekly digest' },
];

export const defaults = {
  variant: 'solid',
  theme: 'gray',
};

function GroupDemo({ variant, theme }: { variant: CheckboxVariant; theme: CheckboxTheme }) {
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
      variant={variant}
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

function CheckboxGroupPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<CheckboxVariant>(
    (searchParams.variant as CheckboxVariant) ?? (defaults.variant as CheckboxVariant)
  );
  const [theme, setTheme] = React.useState<CheckboxTheme>(
    (searchParams.theme as CheckboxTheme) ?? (defaults.theme as CheckboxTheme)
  );

  return (
    <PreviewShell
      preview={<GroupDemo variant={variant} theme={theme} />}
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
        </>
      }
      variants={<CheckboxGroupVariants />}
    />
  );
}

function CheckboxGroupVariants() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-secondary">Solid / Gray</span>
          <GroupDemo variant="solid" theme="gray" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-secondary">Solid / Accent</span>
          <GroupDemo variant="solid" theme="accent" />
        </div>
      </div>
      <div className="flex justify-center gap-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-secondary">Surface / Gray</span>
          <GroupDemo variant="surface" theme="gray" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-secondary">Surface / Accent</span>
          <GroupDemo variant="surface" theme="accent" />
        </div>
      </div>
    </div>
  );
}

const entry = {
  Preview: CheckboxGroupPreview,
  Variants: CheckboxGroupVariants,
  defaults,
};
export default entry;
