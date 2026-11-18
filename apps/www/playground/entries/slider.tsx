import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';
import type { EntrySchema } from '@/playground/lib/types';

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const sliderEntry: EntrySchema = {
  component: 'slider',
  name: 'Slider',
  variants: {
    variant: {
      values: ['solid', 'soft'],
      label: 'Variant',
      default: 'solid',
    },
    size: {
      values: ['sm', 'md', 'lg'],
      label: 'Size',
      default: 'md',
    },
    theme: {
      values: ['gray', 'accent'],
      label: 'Theme',
      default: 'gray',
    },
    orientation: {
      values: ['horizontal', 'vertical'],
      label: 'Orientation',
      default: 'horizontal',
    },
  },
  behavior: {
    range: { type: 'boolean', label: 'Range', default: false },
    disabled: { type: 'boolean', label: 'Disabled', default: false },
  },
  content: {
    value: { type: 'string', label: 'Value', default: '40' },
    min: { type: 'string', label: 'Min', default: '0' },
    max: { type: 'string', label: 'Max', default: '100' },
    step: { type: 'string', label: 'Step', default: '1' },
    showLabel: { type: 'boolean', label: 'Show label', default: true },
    label: {
      type: 'string',
      label: 'Label',
      default: 'Volume',
      visibleWhen: (inputs) => inputs.showLabel === true,
    },
    showValue: { type: 'boolean', label: 'Show value', default: true },
  },
  render: function SliderRender({ variants, behavior, inputs }) {
    const min = toNumber(inputs.min, 0);
    const max = Math.max(toNumber(inputs.max, 100), min + 1);
    const step = Math.max(toNumber(inputs.step, 1), 0.01);
    const value = Math.min(Math.max(toNumber(inputs.value, 40), min), max);
    const range = behavior.range === true;
    const vertical = variants.orientation === 'vertical';
    const label = inputs.showLabel === true ? (inputs.label as string) : 'Value';

    return (
      <div className={vertical ? 'h-48' : 'w-full max-w-80'}>
        <Slider
          key={`${range}-${min}-${max}-${step}-${value}`}
          variant={variants.variant as 'solid' | 'soft'}
          size={variants.size as 'sm' | 'md' | 'lg'}
          theme={variants.theme as string}
          orientation={variants.orientation as 'horizontal' | 'vertical'}
          disabled={behavior.disabled === true}
          min={min}
          max={max}
          step={step}
          defaultValue={range ? [min + (value - min) / 2, value] : value}
        >
          {inputs.showLabel === true && <SliderLabel>{label}</SliderLabel>}
          {inputs.showValue === true && <SliderValue />}
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
            </SliderTrack>
            {range ? (
              <>
                <SliderThumb index={0} aria-label={`${label} minimum`} />
                <SliderThumb index={1} aria-label={`${label} maximum`} />
              </>
            ) : (
              <SliderThumb aria-label={label} />
            )}
          </SliderControl>
        </Slider>
      </div>
    );
  },
};
