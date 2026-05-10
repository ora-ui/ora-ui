'use client';

import * as React from 'react';
import { CodeBlock, CodeBlockRoot } from '@/app/docs/components/code-block';
import {
  CodeBlockCommandBar,
  CodeBlockCopyButton,
} from '@/app/docs/components/code-block-command-bar';
import { Tabs, TabsList, TabsTab, TabsPanel } from '@/components/ui/tabs';

interface CodeBlockTabsClientItem {
  label: string;
  value: string;
  code: string;
  highlighted: React.ReactNode;
}

export function CodeBlockTabsClient({ items }: { items: CodeBlockTabsClientItem[] }) {
  const [active, setActive] = React.useState(items[0]?.value ?? '');
  const activeItem = items.find((i) => i.value === active) ?? items[0];

  return (
    <Tabs value={active} onValueChange={setActive} className="block">
      <CodeBlockRoot>
        <CodeBlockCommandBar className="justify-between">
          <TabsList variant="solid">
            {items.map((item) => (
              <TabsTab key={item.value} value={item.value}>
                {item.label}
              </TabsTab>
            ))}
          </TabsList>
          {activeItem && <CodeBlockCopyButton code={activeItem.code} />}
        </CodeBlockCommandBar>
        {items.map((item) => (
          <TabsPanel key={item.value} value={item.value}>
            <CodeBlock>{item.highlighted}</CodeBlock>
          </TabsPanel>
        ))}
      </CodeBlockRoot>
    </Tabs>
  );
}
