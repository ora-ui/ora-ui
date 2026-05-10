'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { PreviewShell } from '../../components/preview-shell';
import { SelectControl, CheckboxControl, TextControl } from '../../components/controls';
import { CHECKBOX_VARIANTS, CHECKBOX_THEMES } from '../../components/constants';

type CheckboxVariant = (typeof CHECKBOX_VARIANTS)[number];
type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const VARIANT_OPTIONS = CHECKBOX_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

export const defaults = {
  variant: 'solid',
  theme: 'gray',
  label: 'Checkbox label',
  disabled: 'false',
  indeterminate: 'false',
};

function CheckboxPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<CheckboxVariant>(
    (searchParams.variant as CheckboxVariant) ?? (defaults.variant as CheckboxVariant)
  );
  const [theme, setTheme] = React.useState<CheckboxTheme>(
    (searchParams.theme as CheckboxTheme) ?? (defaults.theme as CheckboxTheme)
  );
  const [label, setLabel] = React.useState(searchParams.label ?? defaults.label);
  const [disabled, setDisabled] = React.useState(searchParams.disabled === 'true');
  const [indeterminate, setIndeterminate] = React.useState(searchParams.indeterminate === 'true');

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
    <PreviewShell
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
      variants={<CheckboxVariants />}
    />
  );
}

function CheckboxVariants() {
  return (
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
  );
}

export default {
  Preview: CheckboxPreview,
  Variants: CheckboxVariants,
  defaults,
};
