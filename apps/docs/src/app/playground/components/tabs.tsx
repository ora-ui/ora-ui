'use client';

import * as React from 'react';
import { Tabs, TabsSurface, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl, CheckboxControl } from './controls';
import { TABS_VARIANTS } from './constants';

type TabsVariant = (typeof TABS_VARIANTS)[number];

const VARIANT_OPTIONS = TABS_VARIANTS.map((v) => ({ label: v, value: v }));

const ORIENTATION_OPTIONS = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

const DEMO_TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
  { value: 'disabled', label: 'Disabled', disabled: true },
];

function TabItems() {
  return (
    <>
      {DEMO_TABS.map((tab) => (
        <TabsTab key={tab.value} value={tab.value} disabled={tab.disabled}>
          {tab.label}
        </TabsTab>
      ))}
    </>
  );
}

function DemoTabs({
  variant,
  surface,
  track,
  transition,
  orientation,
}: {
  variant: TabsVariant;
  surface?: boolean;
  track?: boolean;
  transition?: boolean;
  orientation: 'horizontal' | 'vertical';
}) {
  const list = (
    <TabsList variant={variant} track={track} transition={transition}>
      <TabItems />
    </TabsList>
  );

  return (
    <Tabs defaultValue="overview" orientation={orientation}>
      {surface ? <TabsSurface>{list}</TabsSurface> : list}
      <TabsPanel value="overview" className="min-w-28 text-foreground-subtle">
        Overview content
      </TabsPanel>
      <TabsPanel value="activity" className="min-w-28 text-foreground-subtle">
        Activity content
      </TabsPanel>
      <TabsPanel value="settings" className="min-w-28 text-foreground-subtle">
        Settings content
      </TabsPanel>
    </Tabs>
  );
}

export function TabsSection() {
  const [variant, setVariant] = React.useState<TabsVariant>('line');
  const [surface, setSurface] = React.useState(false);
  const [track, setTrack] = React.useState(true);
  const [transition, setTransition] = React.useState(false);
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');

  const preview = (
    <DemoTabs
      variant={variant}
      surface={surface}
      track={track}
      transition={transition}
      orientation={orientation}
    />
  );

  return (
    <ComponentDisplay
      name="Tabs"
      slug="tabs"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Variant"
            value={variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setVariant(v as TabsVariant)}
          />
          <ToolbarSeparator />
          <CheckboxControl label="Surface" checked={surface} onChange={setSurface} />
          <ToolbarSeparator />
          <CheckboxControl label="Track" checked={track} onChange={setTrack} />
          <ToolbarSeparator />
          <CheckboxControl label="Transition" checked={transition} onChange={setTransition} />
          <ToolbarSeparator />
          <SelectControl
            label="Orientation"
            value={orientation}
            options={ORIENTATION_OPTIONS}
            onChange={(v) => setOrientation(v as 'horizontal' | 'vertical')}
          />
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Line variant */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle capitalize">line</p>
          <DemoTabs variant="line" orientation="horizontal" />
        </div>

        {/* Soft variant */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle capitalize">soft</p>
          <DemoTabs variant="soft" orientation="horizontal" />
        </div>

        {/* Soft + surface */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle">soft + surface</p>
          <DemoTabs variant="soft" surface orientation="horizontal" />
        </div>

        {/* Vertical */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle capitalize">vertical</p>
          <div className="flex gap-8">
            <DemoTabs variant="line" orientation="vertical" />
            <DemoTabs variant="soft" orientation="vertical" />
            <DemoTabs variant="soft" surface orientation="vertical" />
          </div>
        </div>
      </div>
    </ComponentDisplay>
  );
}
