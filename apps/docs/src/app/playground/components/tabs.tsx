'use client';

import * as React from 'react';
import { Tabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';
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

function DemoTabs({
  variant,
  contained,
  track,
  orientation,
}: {
  variant: TabsVariant;
  contained: boolean;
  track?: boolean;
  orientation: 'horizontal' | 'vertical';
}) {
  return (
    <Tabs defaultValue="overview" orientation={orientation}>
      <TabsList variant={variant} contained={contained} track={track}>
        {DEMO_TABS.map((tab) => (
          <TabsTab key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
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
  const [contained, setContained] = React.useState(false);
  const [track, setTrack] = React.useState(true);
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>('horizontal');

  const preview = (
    <DemoTabs variant={variant} contained={contained} track={track} orientation={orientation} />
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
            onChange={(v) => {
              setVariant(v as TabsVariant);
              if (v === 'line') setContained(false);
            }}
          />
          <ToolbarSeparator />
          <CheckboxControl
            label="Contained"
            checked={contained}
            disabled={variant === 'line'}
            onChange={setContained}
          />
          <ToolbarSeparator />
          <CheckboxControl
            label="Track"
            checked={track}
            disabled={variant !== 'line'}
            onChange={setTrack}
          />
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
          <DemoTabs variant="line" contained={false} orientation="horizontal" />
        </div>

        {/* Soft variant */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle capitalize">soft</p>
          <DemoTabs variant="soft" contained={false} orientation="horizontal" />
        </div>

        {/* Soft contained */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle">soft contained</p>
          <DemoTabs variant="soft" contained={true} orientation="horizontal" />
        </div>

        {/* Vertical */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle capitalize">vertical</p>
          <div className="flex gap-8">
            <DemoTabs variant="line" contained={false} orientation="vertical" />
            <DemoTabs variant="soft" contained={false} orientation="vertical" />
            <DemoTabs variant="soft" contained={true} orientation="vertical" />
          </div>
        </div>
      </div>
    </ComponentDisplay>
  );
}
