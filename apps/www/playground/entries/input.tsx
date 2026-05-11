'use client';

import * as React from 'react';
import { Input } from '@/registry/ui/input';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { PreviewShell } from '@/playground/components/preview-shell';
import { SelectControl, CheckboxControl, TextControl } from '@/playground/components/controls';
import { INPUT_VARIANTS } from '@/playground/components/constants';

type InputVariant = (typeof INPUT_VARIANTS)[number];

const VARIANT_OPTIONS = INPUT_VARIANTS.map((v) => ({ label: v, value: v }));

export const defaults = {
  variant: 'surface',
  placeholder: 'Enter your email',
  disabled: 'false',
  invalid: 'false',
};

function InputPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<InputVariant>(
    (searchParams.variant as InputVariant) ?? (defaults.variant as InputVariant)
  );
  const [placeholder, setPlaceholder] = React.useState(
    searchParams.placeholder ?? defaults.placeholder
  );
  const [disabled, setDisabled] = React.useState(searchParams.disabled === 'true');
  const [invalid, setInvalid] = React.useState(searchParams.invalid === 'true');

  const preview = (
    <Input
      variant={variant}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className="w-64"
    />
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
            onChange={(v) => setVariant(v as InputVariant)}
          />
          <ToolbarSeparator />
          <TextControl label="Placeholder" value={placeholder} onChange={setPlaceholder} />
          <ToolbarSeparator />
          <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled} />
          <ToolbarSeparator />
          <CheckboxControl label="Invalid" checked={invalid} onChange={setInvalid} />
        </>
      }
      variants={<InputVariants />}
    />
  );
}

function InputVariants() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8">
        {INPUT_VARIANTS.map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <span className="text-xs font-medium text-secondary capitalize">{variant}</span>
            <div className="flex flex-col gap-2">
              <Input variant={variant} placeholder="Default" className="w-64" />
              <Input variant={variant} placeholder="Disabled" disabled className="w-64" />
              <Input variant={variant} placeholder="Invalid" aria-invalid className="w-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const entry = {
  Preview: InputPreview,
  Variants: InputVariants,
  defaults,
};
export default entry;
