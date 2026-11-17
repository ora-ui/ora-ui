import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from '@/registry/ui/progress';
import type { EntrySchema } from '@/playground/lib/types';

export const progressEntry: EntrySchema = {
  component: 'progress',
  name: 'Progress',
  variants: {
    variant: {
      values: ['solid', 'soft'],
      label: 'Variant',
      default: 'solid',
    },
    theme: {
      values: ['gray', 'accent', 'destructive', 'warning', 'success'],
      label: 'Theme',
      default: 'gray',
    },
    size: {
      values: ['sm', 'md', 'lg'],
      label: 'Size',
      default: 'md',
    },
  },
  behavior: {
    value: {
      type: 'number',
      min: 0,
      max: 100,
      step: 1,
      default: 60,
      label: 'Value',
    },
    indeterminate: {
      type: 'boolean',
      label: 'Indeterminate',
      default: false,
    },
  },
  content: {
    showLabel: {
      type: 'boolean',
      label: 'Show label',
      default: true,
    },
    showValue: {
      type: 'boolean',
      label: 'Show value',
      default: true,
    },
    label: {
      type: 'string',
      label: 'Label',
      default: 'Uploading files',
      visibleWhen: (inputs) => inputs.showLabel === true,
    },
  },
  render: function ProgressRender({ variants, behavior, inputs }) {
    return (
      <div className="w-80">
        <Progress
          variant={variants.variant as 'solid' | 'soft'}
          theme={variants.theme as string}
          size={variants.size as 'sm' | 'md' | 'lg'}
          value={behavior.indeterminate === true ? null : (behavior.value as number)}
          aria-label={inputs.showLabel === true ? undefined : (inputs.label as string)}
        >
          {inputs.showLabel === true && <ProgressLabel>{inputs.label as string}</ProgressLabel>}
          {inputs.showValue === true && <ProgressValue />}
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>
    );
  },
};
