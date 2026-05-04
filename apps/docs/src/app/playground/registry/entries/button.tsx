'use client';

import * as React from 'react';
import { ArrowUpIcon, InfoIcon, SparkleIcon, StarIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { PreviewShell } from '../../components/preview-shell';
import { TextControl, SelectControl } from '../../components/controls';
import { BUTTON_VARIANTS, BUTTON_THEMES } from '../../components/constants';

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type ButtonTheme = (typeof BUTTON_THEMES)[number];
type IconVariant = 'none' | 'leading' | 'trailing' | 'icon-only';

const VARIANT_OPTIONS = BUTTON_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = BUTTON_THEMES.map((t) => ({ label: t, value: t }));

const ICON_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'Leading', value: 'leading' },
  { label: 'Trailing', value: 'trailing' },
  { label: 'Icon only', value: 'icon-only' },
];

export const defaults = {
  variant: 'solid',
  theme: 'gray',
  label: 'Button',
  icon: 'none',
};

function ButtonPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<ButtonVariant>(
    (searchParams.variant as ButtonVariant) ?? (defaults.variant as ButtonVariant)
  );
  const [theme, setTheme] = React.useState<ButtonTheme>(
    (searchParams.theme as ButtonTheme) ?? (defaults.theme as ButtonTheme)
  );
  const [text, setText] = React.useState(searchParams.label ?? defaults.label);
  const [icon, setIcon] = React.useState<IconVariant>(
    (searchParams.icon as IconVariant) ?? (defaults.icon as IconVariant)
  );

  const isIconOnly = icon === 'icon-only';

  const preview = isIconOnly ? (
    <Button variant={variant} theme={theme} size="icon">
      <StarIcon />
    </Button>
  ) : (
    <Button variant={variant} theme={theme}>
      {icon === 'leading' && <StarIcon />}
      {text}
      {icon === 'trailing' && <StarIcon />}
    </Button>
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
            onChange={(v) => setVariant(v as ButtonVariant)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as ButtonTheme)}
          />
          <ToolbarSeparator />
          <TextControl label="Label" value={text} onChange={setText} />
          <ToolbarSeparator />
          <SelectControl
            label="Icon"
            value={icon}
            options={ICON_OPTIONS}
            onChange={(v) => setIcon(v as IconVariant)}
          />
        </>
      }
      variants={<ButtonVariants />}
    />
  );
}

function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="solid" theme="accent">
        Get Started
      </Button>
      <Button variant="soft">
        <InfoIcon />
        Learn more
      </Button>
      <Button variant="outline">
        Ask AI
        <SparkleIcon />
      </Button>
      <Button variant="solid" theme="destructive">
        Cancel Subscription
      </Button>
      <Button variant="solid" size="icon">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}

export default {
  Preview: ButtonPreview,
  Variants: ButtonVariants,
  defaults,
};
