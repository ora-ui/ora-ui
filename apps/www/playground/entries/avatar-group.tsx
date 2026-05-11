'use client';

import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/registry/ui/avatar';
import { AvatarGroup, AvatarGroupCount } from '@/registry/ui/avatar-group';
import { PreviewShell } from '@/playground/components/preview-shell';
import { SelectControl, CheckboxControl } from '@/playground/components/controls';
import { ToolbarSeparator } from '@/registry/ui/toolbar';

const AVATAR_COUNT_OPTIONS = [
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

const SIZE_OPTIONS = [
  { label: 'sm', value: 'sm' },
  { label: 'default', value: 'default' },
  { label: 'lg', value: 'lg' },
];

const IMAGE_OPTIONS = [
  { label: 'Photo', value: 'photo' },
  { label: 'None (fallback)', value: 'none' },
];

export const defaults = {
  avatarCount: '3',
  size: 'default',
  showCount: 'false',
  imageType: 'photo',
};

const AVATAR_INITIALS = ['AB', 'CD', 'EF', 'GH', 'IJ'];

function AvatarGroupPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [avatarCount, setAvatarCount] = React.useState(
    searchParams.avatarCount ?? defaults.avatarCount
  );
  const [size, setSize] = React.useState(searchParams.size ?? defaults.size);
  const [showCount, setShowCount] = React.useState(searchParams.showCount === 'true');
  const [imageType, setImageType] = React.useState(searchParams.imageType ?? defaults.imageType);

  const count = parseInt(avatarCount, 10);
  const totalAvatars = 8; // Total number of users

  const imageUrl =
    imageType === 'photo'
      ? 'https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80'
      : undefined;

  const preview = (
    <AvatarGroup>
      {AVATAR_INITIALS.slice(0, count).map((initials, index) => (
        <Avatar key={`${imageType}-${index}`} size={size as 'default' | 'sm' | 'lg'}>
          {imageUrl && <AvatarImage src={imageUrl} alt="Avatar" />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
      {showCount && <AvatarGroupCount>+{totalAvatars - count}</AvatarGroupCount>}
    </AvatarGroup>
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
          <SelectControl
            label="Count"
            value={avatarCount}
            options={AVATAR_COUNT_OPTIONS}
            onChange={setAvatarCount}
          />
          <ToolbarSeparator />
          <SelectControl label="Size" value={size} options={SIZE_OPTIONS} onChange={setSize} />
          <ToolbarSeparator />
          <CheckboxControl label="Show +Count" checked={showCount} onChange={setShowCount} />
        </>
      }
      variants={<AvatarGroupVariants />}
    />
  );
}

function AvatarGroupVariants() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Default</span>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">With count</span>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Small size</span>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Large size</span>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">5 avatars with count</span>
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>IJ</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+10</AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  );
}

const entry = {
  Preview: AvatarGroupPreview,
  Variants: AvatarGroupVariants,
  defaults,
};
export default entry;
