'use client';

import * as React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { PreviewShell } from '../../components/preview-shell';
import { SelectControl, CheckboxControl, TextControl } from '../../components/controls';
import { INPUT_VARIANTS } from '../../components/constants';
import { MagnifyingGlassIcon, EnvelopeIcon, CalendarIcon, LinkIcon } from '@phosphor-icons/react';

const ALIGN_OPTIONS = [
  { label: 'Inline start', value: 'inline-start' },
  { label: 'Inline end', value: 'inline-end' },
  { label: 'Block start', value: 'block-start' },
  { label: 'Block end', value: 'block-end' },
];

const ADDON_OPTIONS = [
  { label: 'Icon', value: 'icon' },
  { label: 'Text', value: 'text' },
  { label: 'Button', value: 'button' },
];

const VARIANT_OPTIONS = INPUT_VARIANTS.map((v) => ({ label: v, value: v }));

type Align = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
type AddonType = 'icon' | 'text' | 'button';
type InputVariant = (typeof INPUT_VARIANTS)[number];

export const defaults = {
  align: 'inline-start',
  addon: 'icon',
  variant: 'surface',
  placeholder: 'Search...',
  addonText: 'https://',
  disabled: 'false',
  invalid: 'false',
};

function DemoAddon({
  align,
  addon,
  addonText,
}: {
  align: Align;
  addon: AddonType;
  addonText: string;
}) {
  if (addon === 'icon') {
    return (
      <InputGroupAddon align={align}>
        <InputGroupText>
          <MagnifyingGlassIcon />
        </InputGroupText>
      </InputGroupAddon>
    );
  }
  if (addon === 'text') {
    return (
      <InputGroupAddon align={align}>
        <InputGroupText>{addonText}</InputGroupText>
      </InputGroupAddon>
    );
  }
  return (
    <InputGroupAddon align={align}>
      <InputGroupButton>Search</InputGroupButton>
    </InputGroupAddon>
  );
}

function InputGroupPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [align, setAlign] = React.useState<Align>(
    (searchParams.align as Align) ?? (defaults.align as Align)
  );
  const [addon, setAddon] = React.useState<AddonType>(
    (searchParams.addon as AddonType) ?? (defaults.addon as AddonType)
  );
  const [variant, setVariant] = React.useState<InputVariant>(
    (searchParams.variant as InputVariant) ?? (defaults.variant as InputVariant)
  );
  const [placeholder, setPlaceholder] = React.useState(
    searchParams.placeholder ?? defaults.placeholder
  );
  const [addonText, setAddonText] = React.useState(searchParams.addonText ?? defaults.addonText);
  const [disabled, setDisabled] = React.useState(searchParams.disabled === 'true');
  const [invalid, setInvalid] = React.useState(searchParams.invalid === 'true');

  const isBlock = align === 'block-start' || align === 'block-end';

  const preview = (
    <InputGroup className="w-72">
      <DemoAddon align={align} addon={addon} addonText={addonText} />
      {isBlock ? (
        <InputGroupTextarea
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          rows={3}
        />
      ) : (
        <InputGroupInput
          variant={variant}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid || undefined}
        />
      )}
    </InputGroup>
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
          <SelectControl
            label="Align"
            value={align}
            options={ALIGN_OPTIONS}
            onChange={(v) => setAlign(v as Align)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Addon"
            value={addon}
            options={ADDON_OPTIONS}
            onChange={(v) => setAddon(v as AddonType)}
          />
          <ToolbarSeparator />
          <TextControl label="Addon text" value={addonText} onChange={setAddonText} />
          <ToolbarSeparator />
          <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled} />
          <ToolbarSeparator />
          <CheckboxControl label="Invalid" checked={invalid} onChange={setInvalid} />
        </>
      }
      variants={<InputGroupVariants />}
    />
  );
}

function InputGroupVariants() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-8">
        {/* Inline icons */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Icon — inline</span>
          <div className="flex flex-col gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <MagnifyingGlassIcon />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="Search..." />
            </InputGroup>
            <InputGroup className="w-72">
              <InputGroupInput placeholder="name@example.com" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  <EnvelopeIcon />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* Inline text */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Text — inline</span>
          <div className="flex flex-col gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon align="inline-start">
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="yoursite.com" />
            </InputGroup>
            <InputGroup className="w-72">
              <InputGroupInput placeholder="username" />
              <InputGroupAddon align="inline-end">
                <InputGroupText>@ora.dev</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* Inline buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Button — inline</span>
          <div className="flex flex-col gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon align="inline-start">
                <InputGroupButton>
                  <LinkIcon />
                </InputGroupButton>
              </InputGroupAddon>
              <InputGroupInput placeholder="Paste a URL..." />
            </InputGroup>
            <InputGroup className="w-72">
              <InputGroupInput placeholder="Pick a date..." />
              <InputGroupAddon align="inline-end">
                <InputGroupButton>
                  <CalendarIcon />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* Block */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">Block — stacked</span>
          <div className="flex flex-col gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon align="block-start">
                <InputGroupText>Message</InputGroupText>
              </InputGroupAddon>
              <InputGroupTextarea placeholder="Enter a message..." rows={3} />
            </InputGroup>
            <InputGroup className="w-72">
              <InputGroupTextarea placeholder="Enter a message..." rows={3} />
              <InputGroupAddon align="block-end">
                <InputGroupText>Max 280 characters</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        {/* States */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-secondary">States</span>
          <div className="flex flex-col gap-2">
            <InputGroup className="w-72">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <MagnifyingGlassIcon />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="Disabled" disabled />
            </InputGroup>
            <InputGroup className="w-72">
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <MagnifyingGlassIcon />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput placeholder="Invalid" aria-invalid />
            </InputGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default {
  Preview: InputGroupPreview,
  Variants: InputGroupVariants,
  defaults,
};
