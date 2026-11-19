import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export default function SliderFormatted() {
  return (
    <Slider
      defaultValue={0.5}
      min={0}
      max={1}
      step={0.01}
      format={{ style: 'percent' }}
      className="w-72"
    >
      <SliderLabel>Opacity</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        <SliderThumb aria-label="Opacity" />
      </SliderControl>
    </Slider>
  );
}
