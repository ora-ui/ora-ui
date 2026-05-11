'use client';

import * as React from 'react';
import { CircleIcon, SparkleIcon, StarIcon } from '@phosphor-icons/react';
import { Badge } from '@/registry/ui/badge';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { PreviewShell } from '@/playground/components/preview-shell';
import { TextControl, SelectControl } from '@/playground/components/controls';
import { BADGE_VARIANTS, BADGE_THEMES } from '@/playground/components/constants';

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

export const defaults = {
  variant: 'soft',
  theme: 'gray',
  label: 'Badge',
  icon: 'none',
};

function BadgePreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<BadgeVariant>(
    (searchParams.variant as BadgeVariant) ?? (defaults.variant as BadgeVariant)
  );
  const [theme, setTheme] = React.useState<BadgeTheme>(
    (searchParams.theme as BadgeTheme) ?? (defaults.theme as BadgeTheme)
  );
  const [text, setText] = React.useState(searchParams.label ?? defaults.label);
  const [icon, setIcon] = React.useState<IconVariant>(
    (searchParams.icon as IconVariant) ?? (defaults.icon as IconVariant)
  );

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
    <PreviewShell
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
      variants={<BadgeVariants />}
    />
  );
}

function BadgeVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="soft" theme="destructive">
        <CircleIcon weight="fill" className="size-2" />
        Live
      </Badge>
      <Badge variant="solid" theme="accent">
        <SparkleIcon weight="fill" />
        New
      </Badge>
      <Badge variant="surface" theme="gray">
        GET
      </Badge>
      <Badge variant="surface" theme="accent">
        POST
      </Badge>
      <Badge variant="solid" theme="destructive">
        8
      </Badge>
    </div>
  );
}

const entry = {
  Preview: BadgePreview,
  Variants: BadgeVariants,
  defaults,
};
export default entry;
