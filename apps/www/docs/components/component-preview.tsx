import { highlight } from 'fumadocs-core/highlight';
import { registry } from '@/docs/previews/registry.generated';
import { ComponentPreviewClient } from './component-preview-client';

type SelectOption = string | { label: string; value: string };

interface ComponentPreviewProps {
  name: string;
  select?: SelectOption[];
}

function normalize(opt: SelectOption): { label: string; value: string } {
  return typeof opt === 'string'
    ? { label: opt.charAt(0).toUpperCase() + opt.slice(1), value: opt }
    : opt;
}

export async function ComponentPreview({ name, select }: ComponentPreviewProps) {
  const entry = registry[name];

  const selectedExports = select
    ? select
        .map(normalize)
        .map((opt) => {
          const exportMeta = entry?.exports.find((e) => e.value === opt.value);
          return exportMeta ? { ...exportMeta, label: opt.label } : null;
        })
        .filter((e): e is NonNullable<typeof e> => e !== null)
    : (entry?.exports ?? []);

  const variants = await Promise.all(
    selectedExports.map(async (exportMeta) => {
      const VariantComponent = exportMeta.component;
      const snippet = exportMeta.snippet ?? '';
      const highlighted = snippet
        ? await highlight(snippet, {
            lang: 'tsx',
            themes: { light: 'github-light-default', dark: 'github-dark' },
          })
        : null;
      return {
        label: exportMeta.label,
        value: exportMeta.value,
        rendered: VariantComponent ? <VariantComponent key={exportMeta.value} /> : null,
        highlighted,
        source: snippet,
        lineCount: snippet.split('\n').length,
      };
    })
  );

  return (
    <div className="mt-3 mb-7 rounded-lg border border-line">
      <ComponentPreviewClient name={name} variants={variants} />
    </div>
  );
}
