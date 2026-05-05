import { highlight } from 'fumadocs-core/highlight';
import sources from '@/components/ui/sources';
import { CodeBlock } from '@/app/docs/components/code-block';

interface ComponentSourceProps {
  name: string;
}

export async function ComponentSource({ name }: ComponentSourceProps) {
  const src = sources[name];

  if (!src) {
    return <p className="text-sm text-secondary">Source not found: {name}</p>;
  }

  const highlighted = await highlight(src, {
    lang: 'tsx',
    themes: { light: 'github-light-default', dark: 'github-dark' },
  });

  return <CodeBlock>{highlighted}</CodeBlock>;
}
