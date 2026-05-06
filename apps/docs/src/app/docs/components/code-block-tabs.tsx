import { highlight } from 'fumadocs-core/highlight';
import { CodeBlockTabsClient } from './code-block-tabs-client';

interface CodeBlockTabsItem {
  label: string;
  value: string;
  code: string;
}

export async function CodeBlockTabs({ items }: { items: CodeBlockTabsItem[] }) {
  const highlightedItems = await Promise.all(
    items.map(async (item) => ({
      ...item,
      highlighted: await highlight(item.code, {
        lang: 'bash',
        themes: { light: 'github-light-default', dark: 'github-dark' },
      }),
    }))
  );

  return <CodeBlockTabsClient items={highlightedItems} />;
}
