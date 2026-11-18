import { Link } from '@/registry/ui/link';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/ui/preview-card';
import type { EntrySchema } from '@/playground/lib/types';

export const previewCardEntry: EntrySchema = {
  component: 'preview-card',
  name: 'Preview Card',
  variants: {
    side: {
      label: 'Side',
      values: ['top', 'right', 'bottom', 'left'],
      default: 'bottom',
    },
    align: {
      label: 'Align',
      values: ['start', 'center', 'end'],
      default: 'center',
    },
  },
  content: {
    sideOffset: {
      type: 'string',
      label: 'Side offset',
      default: '4',
    },
    delay: {
      type: 'string',
      label: 'Delay (ms)',
      default: '600',
    },
    closeDelay: {
      type: 'string',
      label: 'Close delay (ms)',
      default: '300',
    },
    link: {
      type: 'string',
      label: 'Link text',
      default: 'Ora UI',
    },
    title: {
      type: 'string',
      label: 'Card title',
      default: 'Ora UI',
    },
    description: {
      type: 'string',
      label: 'Card text',
      default: 'Styled primitives and composable patterns for building accessible interfaces.',
    },
  },
  render: function PreviewCardRender({ variants, inputs }) {
    const offset = Number(inputs.sideOffset);
    const delay = Number(inputs.delay);
    const closeDelay = Number(inputs.closeDelay);

    return (
      <PreviewCard>
        <PreviewCardTrigger
          delay={Number.isFinite(delay) ? delay : 600}
          closeDelay={Number.isFinite(closeDelay) ? closeDelay : 300}
          render={<Link href="https://ora-ui.com" underline="always" />}
        >
          {inputs.link as string}
        </PreviewCardTrigger>
        <PreviewCardContent
          side={variants.side as 'top' | 'right' | 'bottom' | 'left'}
          align={variants.align as 'start' | 'center' | 'end'}
          sideOffset={Number.isFinite(offset) ? offset : 4}
          className="flex flex-col gap-1"
        >
          <p className="font-medium">{inputs.title as string}</p>
          <p className="text-secondary">{inputs.description as string}</p>
        </PreviewCardContent>
      </PreviewCard>
    );
  },
};
