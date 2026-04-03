'use client';

import * as React from 'react';
import { ArrowUpIcon, InfoIcon, SparkleIcon, StarIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { TextControl, SelectControl } from './controls';
import { BUTTON_VARIANTS, BUTTON_THEMES } from './constants';

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

export function ButtonSection() {
  const [text, setText] = React.useState('Button');
  const [icon, setIcon] = React.useState<IconVariant>('none');
  const [variant, setVariant] = React.useState<ButtonVariant>('solid');
  const [theme, setTheme] = React.useState<ButtonTheme>('gray');

  const isIconOnly = icon === 'icon-only';

  function handleIconChange(next: string) {
    setIcon(next as IconVariant);
  }

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
    <ComponentDisplay
      name="Button"
      slug="button"
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
            onChange={handleIconChange}
          />
        </>
      }
    >
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
    </ComponentDisplay>
  );
}
