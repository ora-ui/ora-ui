import { highlight } from 'fumadocs-core/highlight';
import { registry } from '@/previews/registry';
import { CodeBlock } from '@/app/docs/components/code-block';
import { CodeCollapsibleWrapper } from '@/app/docs/components/code-collapsible-wrapper';

interface ComponentPreviewProps {
  name: string;
}

export async function ComponentPreview({ name }: ComponentPreviewProps) {
  const entry = registry[name];

  const source = entry?.source ?? null;
  const lineCount = source ? source.split('\n').length : 0;

  const highlighted = source
    ? await highlight(source, {
        lang: 'tsx',
        themes: { light: 'github-light-default', dark: 'github-dark' },
      })
    : null;

  const Preview = entry?.component;

  return (
    <div className="mt-3 mb-7 rounded-lg border border-line">
      <div className="flex min-h-50 items-center justify-center p-6">
        {Preview ? (
          <Preview />
        ) : (
          <p className="text-sm text-secondary">Preview not found: {name}</p>
        )}
      </div>
      {highlighted && (
        <div className="border-t border-line">
          <CodeCollapsibleWrapper lineCount={lineCount}>
            <div className="[&>div]:my-0 [&>div>pre]:rounded-none [&>div>pre]:border-0">
              <CodeBlock>{highlighted}</CodeBlock>
            </div>
          </CodeCollapsibleWrapper>
        </div>
      )}
    </div>
  );
}
