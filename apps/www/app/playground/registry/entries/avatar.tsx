'use client';

import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '@/registry/ui/avatar';
import { PreviewShell } from '../../components/preview-shell';
import { SelectControl, TextControl, CheckboxControl } from '../../components/controls';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { cn } from '@/registry/lib/utils';

type Theme = 'gray' | 'accent';

const THEME_OPTIONS = [
  { label: 'gray', value: 'gray' },
  { label: 'accent', value: 'accent' },
];

const RADIUS_OPTIONS = [
  { label: 'full', value: 'full' },
  { label: 'lg', value: 'lg' },
  { label: 'md', value: 'md' },
  { label: 'sm', value: 'sm' },
  { label: 'none', value: 'none' },
];

const SIZE_OPTIONS = [
  { label: '32px', value: 'size-8' },
  { label: '64px', value: 'size-16' },
  { label: '128px', value: 'size-32' },
];

const IMAGE_OPTIONS = [
  { label: 'Photo', value: 'photo' },
  { label: 'Logo', value: 'logo' },
  { label: 'None (fallback)', value: 'none' },
];

export const defaults = {
  theme: 'gray',
  radius: 'full',
  size: 'size-16',
  fallback: 'AB',
  imageType: 'photo',
  showBadge: 'false',
};

function AvatarPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [theme, setTheme] = React.useState<Theme>(
    (searchParams.theme as Theme) ?? (defaults.theme as Theme)
  );
  const [radius, setRadius] = React.useState(searchParams.radius ?? defaults.radius);
  const [size, setSize] = React.useState(searchParams.size ?? defaults.size);
  const [fallback, setFallback] = React.useState(searchParams.fallback ?? defaults.fallback);
  const [imageType, setImageType] = React.useState(searchParams.imageType ?? defaults.imageType);
  const [showBadge, setShowBadge] = React.useState(searchParams.showBadge === 'true');

  const imageUrl =
    imageType === 'photo'
      ? 'https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80'
      : imageType === 'logo'
        ? '/ora-ui_logo.png'
        : undefined;

  const preview = (
    <Avatar
      key={imageType}
      theme={theme}
      className={cn(size, `rounded-${radius}`, `after:rounded-${radius}`)}
    >
      {imageUrl && <AvatarImage src={imageUrl} alt="Avatar" />}
      <AvatarFallback>{fallback}</AvatarFallback>
      {showBadge && <AvatarBadge />}
    </Avatar>
  );

  return (
    <PreviewShell
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Image"
            value={imageType}
            options={IMAGE_OPTIONS}
            onChange={setImageType}
          />
          <ToolbarSeparator />
          <SelectControl label="Size" value={size} options={SIZE_OPTIONS} onChange={setSize} />
          <ToolbarSeparator />
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as Theme)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Radius"
            value={radius}
            options={RADIUS_OPTIONS}
            onChange={setRadius}
          />
          <ToolbarSeparator />
          <TextControl label="Fallback" value={fallback} onChange={setFallback} />
          <ToolbarSeparator />
          <CheckboxControl label="Show Badge" checked={showBadge} onChange={setShowBadge} />
        </>
      }
      variants={<AvatarVariants />}
    />
  );
}

function AvatarVariants() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">With image</span>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
              alt="User avatar"
            />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Fallback - Gray theme</span>
        <div className="flex items-center gap-3">
          <Avatar theme="gray">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar theme="gray">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar theme="gray">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Fallback - Accent theme</span>
        <div className="flex items-center gap-3">
          <Avatar theme="accent">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar theme="accent">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar theme="accent">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Logo</span>
        <div className="flex items-center gap-3">
          <Avatar className="rounded-lg after:rounded-lg">
            <AvatarImage src="/ora-ui_logo.png" alt="Ora UI Logo" />
            <AvatarFallback>OU</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Different sizes</span>
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">AB</AvatarFallback>
          </Avatar>
          <Avatar className="size-12">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="size-16">
            <AvatarFallback className="text-lg">EF</AvatarFallback>
          </Avatar>
          <Avatar className="size-20">
            <AvatarFallback className="text-xl">GH</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Different radius</span>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar className="rounded-lg after:rounded-lg">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar className="rounded-md after:rounded-md">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <Avatar className="rounded-sm after:rounded-sm">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default {
  Preview: AvatarPreview,
  Variants: AvatarVariants,
  defaults,
};
