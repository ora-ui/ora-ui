'use client';

import * as React from 'react';
import { StarIcon, SunIcon } from '@phosphor-icons/react';
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
      <div
        className="grid gap-x-4 gap-y-2"
        style={{
          gridTemplateColumns: `auto repeat(${BUTTON_THEMES.length + 2}, 1fr)`,
        }}
      >
        <div />
        {BUTTON_THEMES.map((t) => (
          <div key={t} className="text-xs font-medium text-foreground-subtle capitalize">
            {t}
          </div>
        ))}
        <div className="text-xs font-medium text-foreground-subtle">disabled</div>
        <div className="text-xs font-medium text-foreground-subtle">icon</div>

        {BUTTON_VARIANTS.map((v) => (
          <React.Fragment key={v}>
            <div className="flex items-center pr-5 text-xs text-foreground-subtle capitalize">
              {v}
            </div>
            {BUTTON_THEMES.map((t) => (
              <div key={t} className="flex items-center">
                <Button variant={v} theme={t}>
                  {v}
                </Button>
              </div>
            ))}
            <div className="flex items-center">
              <Button variant={v} disabled>
                {v}
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant={v} size="icon">
                <SunIcon />
              </Button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </ComponentDisplay>
  );
}
