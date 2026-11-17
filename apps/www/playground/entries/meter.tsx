import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from '@/registry/ui/meter';
import type { EntrySchema } from '@/playground/lib/types';

export const meterEntry: EntrySchema = {
  component: 'meter',
  name: 'Meter',
  variants: {
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
      default: 24,
      label: 'Value',
    },
    min: {
      type: 'number',
      min: 0,
      max: 90,
      step: 10,
      default: 0,
      label: 'Min',
    },
    max: {
      type: 'number',
      min: 100,
      max: 200,
      step: 10,
      default: 100,
      label: 'Max',
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
      default: 'Storage used',
      visibleWhen: (inputs) => inputs.showLabel === true,
    },
  },
  render: function MeterRender({ variants, behavior, inputs }) {
    return (
      <div className="w-80">
        <Meter
          theme={variants.theme as string}
          size={variants.size as 'sm' | 'md' | 'lg'}
          value={behavior.value as number}
          min={behavior.min as number}
          max={behavior.max as number}
          aria-label={inputs.showLabel === true ? undefined : (inputs.label as string)}
        >
          {inputs.showLabel === true && <MeterLabel>{inputs.label as string}</MeterLabel>}
          {inputs.showValue === true && <MeterValue />}
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>
    );
  },
};
