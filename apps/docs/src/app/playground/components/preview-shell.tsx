'use client';

import * as React from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SquaresFourIcon } from '@phosphor-icons/react';
import { BACKGROUNDS } from './constants';

interface PreviewShellProps {
  /** The component being previewed */
  preview: React.ReactNode;
  /** Control elements for configuring the preview */
  controls?: React.ReactNode;
  /** The all-variants grid */
  variants?: React.ReactNode;
}

export function PreviewShell({ preview, controls, variants }: PreviewShellProps) {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);
  const [showVariants, setShowVariants] = React.useState(false);

  return (
    <div className="flex flex-1 flex-col">
      {/* Preview area */}
      <div
        className="flex flex-1 items-center justify-center p-8"
        style={{ backgroundColor: background }}
      >
        {preview}
      </div>

      {/* Variants panel */}
      {showVariants && variants && (
        <>
          <Separator />
          <div className="max-h-80 overflow-y-auto p-6">{variants}</div>
        </>
      )}

      {/* Bottom toolbar */}
      <Separator />
      <div className="shrink-0 overflow-x-auto px-4 py-2.5 bg-surface-1">
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
          {variants && (
            <>
              <ToolbarSeparator />
              <ToolbarGroup>
                <Button
                  variant={showVariants ? 'soft' : 'ghost'}
                  size="sm"
                  onClick={() => setShowVariants(!showVariants)}
                >
                  <SquaresFourIcon />
                  All Variants
                </Button>
              </ToolbarGroup>
            </>
          )}
        </Toolbar>
      </div>
    </div>
  );
}
