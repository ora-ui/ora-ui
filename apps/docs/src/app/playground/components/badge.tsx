'use client';

import * as React from 'react';
import { StarIcon } from '@heroicons/react/16/solid';
import { Badge } from '@/components/ui/badge';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { TextControl, SelectControl } from './controls';
import { BADGE_VARIANTS, BADGE_THEMES } from './constants';

type BadgeVariant = (typeof BADGE_VARIANTS)[number];
type BadgeTheme = (typeof BADGE_THEMES)[number];
type IconVariant = 'none' | 'with-icon' | 'icon-only';

const VARIANT_OPTIONS = BADGE_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = BADGE_THEMES.map((t) => ({ label: t, value: t }));
const ICON_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'With icon', value: 'with-icon' },
  { label: 'Icon only', value: 'icon-only' },
];

export function BadgeSection() {
  const [text, setText] = React.useState('Badge');
  const [icon, setIcon] = React.useState<IconVariant>('none');
  const [variant, setVariant] = React.useState<BadgeVariant>('soft');
  const [theme, setTheme] = React.useState<BadgeTheme>('gray');

  const preview =
    icon === 'icon-only' ? (
      <Badge variant={variant} theme={theme} size="icon">
        <StarIcon />
      </Badge>
    ) : (
      <Badge variant={variant} theme={theme}>
        {icon === 'with-icon' && <StarIcon />}
        {text}
      </Badge>
    );

  return (
    <ComponentDisplay
      name="Badge"
      slug="badge"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Variant"
            value={variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setVariant(v as BadgeVariant)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as BadgeTheme)}
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
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `8rem repeat(${BADGE_THEMES.length}, 1fr)`,
        }}
      >
        <div />
        {BADGE_THEMES.map((t) => (
          <div key={t} className="text-xs font-medium text-foreground-subtle capitalize">
            {t}
          </div>
        ))}

        {BADGE_VARIANTS.map((v) => (
          <React.Fragment key={v}>
            <div className="flex items-center text-sm text-foreground-subtle capitalize">{v}</div>
            {BADGE_THEMES.map((t) => (
              <div key={t} className="flex items-center">
                <Badge variant={v} theme={t}>
                  Badge
                </Badge>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </ComponentDisplay>
  );
}
