import { highlight } from 'fumadocs-core/highlight';
import { registry } from '@/previews/registry';
import { CodeBlock } from '@/app/docs/components/code-block';

interface ComponentPreviewProps {
  name: string;
}

export async function ComponentPreview({ name }: ComponentPreviewProps) {
  const entry = registry[name];

  const highlighted = entry?.source
    ? await highlight(entry.source, {
        lang: 'tsx',
        themes: { light: 'github-light-default', dark: 'github-dark' },
      })
    : null;

  const Preview = entry?.component;

  return (
    <div className="mt-3 mb-7 overflow-hidden rounded-lg border border-line">
      <div className="flex min-h-50 items-center justify-center p-6">
        {Preview ? (
          <Preview />
        ) : (
          <p className="text-sm text-secondary">Preview not found: {name}</p>
        )}
      </div>
      {highlighted && (
        <div className="border-t border-line [&>div]:my-0 [&>div>pre]:rounded-none [&>div>pre]:border-0">
          <CodeBlock>{highlighted}</CodeBlock>
        </div>
      )}
    </div>
  );
}
