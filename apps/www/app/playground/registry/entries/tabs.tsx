'use client';

import * as React from 'react';
import { Tabs, TabsSurface, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { PreviewShell } from '../../components/preview-shell';
import { SelectControl, CheckboxControl } from '../../components/controls';
import { TABS_VARIANTS } from '../../components/constants';

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

export const defaults = {
  variant: 'solid',
  surface: 'false',
  track: 'true',
  transition: 'false',
  orientation: 'horizontal',
};

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
      <TabsPanel value="overview" className="min-w-28 text-secondary">
        Overview content
      </TabsPanel>
      <TabsPanel value="activity" className="min-w-28 text-secondary">
        Activity content
      </TabsPanel>
      <TabsPanel value="settings" className="min-w-28 text-secondary">
        Settings content
      </TabsPanel>
    </Tabs>
  );
}

function TabsPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [variant, setVariant] = React.useState<TabsVariant>(
    (searchParams.variant as TabsVariant) ?? (defaults.variant as TabsVariant)
  );
  const [surface, setSurface] = React.useState(searchParams.surface === 'true');
  const [transition, setTransition] = React.useState(searchParams.transition === 'true');
  const [orientation, setOrientation] = React.useState<'horizontal' | 'vertical'>(
    (searchParams.orientation as 'horizontal' | 'vertical') ??
      (defaults.orientation as 'horizontal' | 'vertical')
  );

  const preview = (
    <DemoTabs
      variant={variant}
      surface={surface}
      transition={transition}
      orientation={orientation}
    />
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
            onChange={(v) => setVariant(v as TabsVariant)}
          />
          <ToolbarSeparator />
          <CheckboxControl label="Surface" checked={surface} onChange={setSurface} />
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
      variants={<TabsVariants />}
    />
  );
}

function TabsVariants() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Solid variant</span>
        <Tabs defaultValue="overview">
          <TabsList variant="solid">
            <TabItems />
          </TabsList>
          <TabsPanel value="overview" className="min-w-28 text-secondary">
            Overview content
          </TabsPanel>
          <TabsPanel value="activity" className="min-w-28 text-secondary">
            Activity content
          </TabsPanel>
          <TabsPanel value="settings" className="min-w-28 text-secondary">
            Settings content
          </TabsPanel>
        </Tabs>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Soft variant</span>
        <Tabs defaultValue="overview">
          <TabsList variant="soft">
            <TabItems />
          </TabsList>
          <TabsPanel value="overview" className="min-w-28 text-secondary">
            Overview content
          </TabsPanel>
          <TabsPanel value="activity" className="min-w-28 text-secondary">
            Activity content
          </TabsPanel>
          <TabsPanel value="settings" className="min-w-28 text-secondary">
            Settings content
          </TabsPanel>
        </Tabs>
      </div>
    </div>
  );
}

export default {
  Preview: TabsPreview,
  Variants: TabsVariants,
  defaults,
};
