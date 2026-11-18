import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export default function SliderDisabled() {
  return (
    <Slider disabled defaultValue={40} className="w-72">
      <SliderLabel>Volume</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        <SliderThumb aria-label="Volume" />
      </SliderControl>
    </Slider>
  );
}
