import { highlight } from 'fumadocs-core/highlight';
import sources from '@/components/ui/sources';
import { CodeBlock } from '@/app/docs/components/code-block';
import { CodeCollapsibleWrapper } from '@/app/docs/components/code-collapsible-wrapper';
import {
  CodeBlockCommandBar,
  CodeBlockCopyButton,
} from '@/app/docs/components/code-block-command-bar';

interface ComponentSourceProps {
  name: string;
}

export async function ComponentSource({ name }: ComponentSourceProps) {
  const src = sources[name];

  if (!src) {
    return <p className="text-sm text-secondary">Source not found: {name}</p>;
  }

  const lineCount = src.split('\n').length;

  const highlighted = await highlight(src, {
    lang: 'tsx',
    themes: { light: 'github-light-default', dark: 'github-dark' },
  });

  return (
    <div className="mb-5 rounded-md border border-line">
      <CodeCollapsibleWrapper
        lineCount={lineCount}
        triggerClassName="rounded-b-md"
        commandBar={
          <CodeBlockCommandBar className="justify-between rounded-t-md">
            <span className="px-1 text-sm text-muted">{`components/ui/${name}.tsx`}</span>
            <CodeBlockCopyButton code={src} />
          </CodeBlockCommandBar>
        }
      >
        <CodeBlock>{highlighted}</CodeBlock>
      </CodeCollapsibleWrapper>
    </div>
  );
}
