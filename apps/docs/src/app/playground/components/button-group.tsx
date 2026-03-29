'use client';

import * as React from 'react';
import { StarIcon } from '@heroicons/react/16/solid';
import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl } from './controls';
import { BUTTON_VARIANTS } from './constants';

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type Orientation = 'horizontal' | 'vertical';
type Content = 'text' | 'icon' | 'mixed';

const TEXT_LABELS = ['First', 'Second', 'Third', 'Fourth'] as const;

const VARIANT_OPTIONS = BUTTON_VARIANTS.map((v) => ({ label: v, value: v }));
const ORIENTATION_OPTIONS = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];
const ITEMS_OPTIONS = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
];
const CONTENT_OPTIONS = [
  { label: 'Text', value: 'text' },
  { label: 'Icon', value: 'icon' },
  { label: 'Mixed', value: 'mixed' },
];

function withSeparators(
  buttons: React.ReactNode[],
  variant: ButtonVariant,
  orientation: Orientation
) {
  if (variant !== 'solid' && variant !== 'soft') return buttons;
  const sepOrientation = orientation === 'vertical' ? 'horizontal' : 'vertical';
  return buttons.flatMap((btn, i) =>
    i < buttons.length - 1
      ? [btn, <ButtonGroupSeparator key={`sep-${i}`} orientation={sepOrientation} />]
      : [btn]
  );
}

function renderItems(
  variant: ButtonVariant,
  items: number,
  content: Content,
  orientation: Orientation
) {
  let buttons: React.ReactNode[];

  if (content === 'icon') {
    buttons = Array.from({ length: items }, (_, i) => (
      <Button key={i} variant={variant} size="icon" aria-label={`Item ${i + 1}`}>
        <StarIcon />
      </Button>
    ));
  } else if (content === 'mixed') {
    const textCount = items - 1;
    buttons = [
      ...Array.from({ length: textCount }, (_, i) => (
        <Button key={i} variant={variant}>
          {TEXT_LABELS[i]}
        </Button>
      )),
      <Button key="icon" variant={variant} size="icon" aria-label="More">
        <StarIcon />
      </Button>,
    ];
  } else {
    buttons = Array.from({ length: items }, (_, i) => (
      <Button key={i} variant={variant}>
        {TEXT_LABELS[i]}
      </Button>
    ));
  }

  return withSeparators(buttons, variant, orientation);
}

export function ButtonGroupSection() {
  const [orientation, setOrientation] = React.useState<Orientation>('horizontal');
  const [variant, setVariant] = React.useState<ButtonVariant>('outline');
  const [items, setItems] = React.useState('3');
  const [content, setContent] = React.useState<Content>('text');

  const itemCount = parseInt(items, 10);

  const preview = (
    <ButtonGroup orientation={orientation}>
      {renderItems(variant, itemCount, content, orientation)}
    </ButtonGroup>
  );

  return (
    <ComponentDisplay
      name="Button Group"
      slug="button-group"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Orientation"
            value={orientation}
            options={ORIENTATION_OPTIONS}
            onChange={(v) => setOrientation(v as Orientation)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Variant"
            value={variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setVariant(v as ButtonVariant)}
          />
          <ToolbarSeparator />
          <SelectControl label="Items" value={items} options={ITEMS_OPTIONS} onChange={setItems} />
          <ToolbarSeparator />
          <SelectControl
            label="Content"
            value={content}
            options={CONTENT_OPTIONS}
            onChange={(v) => setContent(v as Content)}
          />
        </>
      }
    >
      <div className="flex items-start gap-8">
        <div className="space-y-2">
          <span className="text-xs text-foreground-subtle">Horizontal</span>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-foreground-subtle">Vertical</span>
          <ButtonGroup orientation="vertical">
            <Button variant="outline">Top</Button>
            <Button variant="outline">Bottom</Button>
          </ButtonGroup>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-foreground-subtle">Mixed</span>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline" size="icon" aria-label="More">
              <StarIcon />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </ComponentDisplay>
  );
}
