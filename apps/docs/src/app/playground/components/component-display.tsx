'use client';

import * as React from 'react';
import Link from 'next/link';
import { Tabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { BACKGROUNDS } from './constants';

interface ComponentDisplayProps {
  name: string;
  slug: string;
  /** Overview tab: full variants × themes grid */
  children: React.ReactNode;
  /** Playground tab: single configured instance */
  preview?: React.ReactNode;
  /** Toolbar controls for the playground tab */
  controls?: React.ReactNode;
}

export function ComponentDisplay({
  name,
  slug,
  children,
  preview,
  controls,
}: ComponentDisplayProps) {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3" id={slug}>
        <h2 className="text-xl font-semibold">{name}</h2>
        <Link
          href={`/docs/components/${slug}`}
          className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
        >
          View docs →
        </Link>
      </div>

      <Tabs defaultValue="overview">
        <div className="rounded-lg border border-line-subtle overflow-hidden">
          {preview && (
            <>
              <div className="px-3 py-3 bg-surface-1">
                <TabsList variant="soft">
                  <TabsTab value="overview">Overview</TabsTab>
                  <TabsTab value="playground">Playground</TabsTab>
                </TabsList>
              </div>
              <Separator />
            </>
          )}

          <TabsPanel value="overview">
            <div className="p-6">{children}</div>
          </TabsPanel>

          {preview && (
            <TabsPanel value="playground">
              <div
                className="flex min-h-50 items-center justify-center p-6"
                style={{ backgroundColor: background }}
              >
                {preview}
              </div>
              <Separator />
              <div className="overflow-x-auto px-4 py-2.5">
                <Toolbar className="min-w-max">
                  {controls}
                  {controls && <ToolbarSeparator />}
                  <ToolbarGroup className="gap-2">
                    <Label className="text-xs font-normal text-foreground-subtle">Background</Label>
                    <select
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="rounded-md border border-line bg-background px-2 py-1 text-xs text-foreground"
                    >
                      {BACKGROUNDS.map((bg) => (
                        <option key={bg.label} value={bg.value}>
                          {bg.label}
                        </option>
                      ))}
                    </select>
                  </ToolbarGroup>
                </Toolbar>
              </div>
            </TabsPanel>
          )}
        </div>
      </Tabs>
    </section>
  );
}
