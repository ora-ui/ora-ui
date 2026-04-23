'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { PreviewShell } from '../../components/preview-shell';
import { SelectControl, CheckboxControl, TextControl } from '../../components/controls';
import { CHECKBOX_THEMES } from '../../components/constants';

type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

export const defaults = {
  theme: 'accent',
  label: 'Checkbox label',
  disabled: 'false',
  indeterminate: 'false',
};

function CheckboxPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [theme, setTheme] = React.useState<CheckboxTheme>(
    (searchParams.theme as CheckboxTheme) ?? (defaults.theme as CheckboxTheme)
  );
  const [label, setLabel] = React.useState(searchParams.label ?? defaults.label);
  const [disabled, setDisabled] = React.useState(searchParams.disabled === 'true');
  const [indeterminate, setIndeterminate] = React.useState(searchParams.indeterminate === 'true');

  const preview = (
    <label className="flex items-center gap-2">
      <Checkbox theme={theme} disabled={disabled} indeterminate={indeterminate} defaultChecked />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );

  return (
    <PreviewShell
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
      variants={<CheckboxVariants />}
    />
  );
}

function CheckboxVariants() {
  return (
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
  );
}

export default {
  Preview: CheckboxPreview,
  Variants: CheckboxVariants,
  defaults,
};
