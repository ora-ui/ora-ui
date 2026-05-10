'use client';

import * as React from 'react';
import { CodeBlock } from '@/app/docs/components/code-block';
import { CodeCollapsibleWrapper } from '@/app/docs/components/code-collapsible-wrapper';
import {
  CodeBlockCommandBar,
  CodeBlockExpandButton,
  CodeBlockCopyButton,
} from '@/app/docs/components/code-block-command-bar';
import { Separator } from '@/components/ui/separator';

export interface VariantItem {
  label: string;
  value: string;
  rendered: React.ReactNode | null;
  highlighted: React.ReactNode | null;
  source: string;
  lineCount: number;
}

export function ComponentPreviewClient({
  name,
  preview,
  variants,
}: {
  name: string;
  preview?: React.ReactNode;
  variants?: VariantItem[];
}) {
  const [activeValue, setActiveValue] = React.useState(variants?.[0]?.value ?? '');
  const activeVariant = variants?.find((v) => v.value === activeValue) ?? variants?.[0];

  return (
    <>
      <div className="relative flex min-h-50 items-center justify-center p-6">
        {variants && (
          <select
            className="absolute top-3 right-3 cursor-pointer rounded-md border border-line bg-surface px-2 py-1 text-sm text-secondary"
            value={activeValue}
            onChange={(e) => setActiveValue(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        )}
        {variants
          ? (activeVariant?.rendered ?? (
              <p className="text-sm text-secondary">Preview not found: {name}</p>
            ))
          : (preview ?? <p className="text-sm text-secondary">Preview not found: {name}</p>)}
      </div>
      {variants && activeVariant?.highlighted && (
        <div className="border-t border-line">
          <CodeCollapsibleWrapper
            lineCount={activeVariant.lineCount}
            commandBar={
              <CodeBlockCommandBar>
                <CodeBlockExpandButton />
                <Separator orientation="vertical" />
                <CodeBlockCopyButton code={activeVariant.source} />
              </CodeBlockCommandBar>
            }
          >
            <CodeBlock>{activeVariant.highlighted}</CodeBlock>
          </CodeCollapsibleWrapper>
        </div>
      )}
    </>
  );
}
