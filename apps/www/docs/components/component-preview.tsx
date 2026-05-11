import { highlight } from 'fumadocs-core/highlight';
import { registry } from '@/docs/previews/registry.generated';
import { CodeBlock } from '@/docs/components/code-block';
import { CodeCollapsibleWrapper } from '@/docs/components/code-collapsible-wrapper';
import {
  CodeBlockCommandBar,
  CodeBlockExpandButton,
  CodeBlockCopyButton,
} from '@/docs/components/code-block-command-bar';
import { Separator } from '@/registry/ui/separator';
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

  if (select && entry) {
    const options = select.map(normalize);
    const variants = await Promise.all(
      options.map(async (opt) => {
        const exportMeta = entry.exports.find((e) => e.value === opt.value);
        const VariantComponent = exportMeta?.component;
        const snippet = exportMeta?.snippet ?? '';
        const highlighted = snippet
          ? await highlight(snippet, {
              lang: 'tsx',
              themes: { light: 'github-light-default', dark: 'github-dark' },
            })
          : null;
        return {
          ...opt,
          rendered: VariantComponent ? <VariantComponent key={opt.value} /> : null,
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

  const source = entry?.source ?? null;
  const lineCount = source ? source.split('\n').length : 0;
  const highlighted = source
    ? await highlight(source, {
        lang: 'tsx',
        themes: { light: 'github-light-default', dark: 'github-dark' },
      })
    : null;

  const Preview = entry?.defaultExport.component;

  return (
    <div className="mt-3 mb-7 rounded-lg border border-line">
      <ComponentPreviewClient name={name} preview={Preview ? <Preview /> : undefined} />
      {highlighted && (
        <div className="border-t border-line">
          <CodeCollapsibleWrapper
            lineCount={lineCount}
            commandBar={
              <CodeBlockCommandBar>
                <CodeBlockExpandButton />
                <Separator orientation="vertical" />
                <CodeBlockCopyButton code={source!} />
              </CodeBlockCommandBar>
            }
          >
            <CodeBlock>{highlighted}</CodeBlock>
          </CodeCollapsibleWrapper>
        </div>
      )}
    </div>
  );
}
