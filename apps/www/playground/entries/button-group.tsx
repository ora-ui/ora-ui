'use client';

import * as React from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  CopyIcon,
  StarIcon,
} from '@phosphor-icons/react';
import { Button } from '@/registry/ui/button';
import { ButtonGroup, ButtonGroupSeparator } from '@/registry/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/registry/ui/dropdown-menu';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { PreviewShell } from '@/playground/components/preview-shell';
import { SelectControl } from '@/playground/components/controls';
import { BUTTON_VARIANTS } from '@/playground/components/constants';

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

export const defaults = {
  variant: 'outline',
  orientation: 'horizontal',
  items: '3',
  content: 'text',
};

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

function ButtonGroupPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [orientation, setOrientation] = React.useState<Orientation>(
    (searchParams.orientation as Orientation) ?? (defaults.orientation as Orientation)
  );
  const [variant, setVariant] = React.useState<ButtonVariant>(
    (searchParams.variant as ButtonVariant) ?? (defaults.variant as ButtonVariant)
  );
  const [items, setItems] = React.useState(searchParams.items ?? defaults.items);
  const [content, setContent] = React.useState<Content>(
    (searchParams.content as Content) ?? (defaults.content as Content)
  );

  const itemCount = parseInt(items, 10);

  const preview = (
    <ButtonGroup orientation={orientation}>
      {renderItems(variant, itemCount, content, orientation)}
    </ButtonGroup>
  );

  return (
    <PreviewShell
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
      variants={<ButtonGroupVariants />}
    />
  );
}

function ButtonGroupVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <ButtonGroup>
        <ButtonGroup>
          <Button variant="soft">
            <CopyIcon />
            Copy page
          </Button>
          <ButtonGroupSeparator />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="soft" size="icon" aria-label="Copy options">
                  <CaretDownIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View as markdown</DropdownMenuItem>
              <DropdownMenuItem>Open in ChatGPT</DropdownMenuItem>
              <DropdownMenuItem>Open in Claude</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroup>
            <Button variant="soft" size="icon" aria-label="Previous">
              <ArrowLeftIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="soft" size="icon" aria-label="Next">
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  );
}

const entry = {
  Preview: ButtonGroupPreview,
  Variants: ButtonGroupVariants,
  defaults,
};
export default entry;
