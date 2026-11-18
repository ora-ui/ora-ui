import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export default function SliderRange() {
  return (
    <Slider defaultValue={[25, 75]} className="w-72">
      <SliderLabel>Price range</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        <SliderThumb index={0} aria-label="Minimum price" />
        <SliderThumb index={1} aria-label="Maximum price" />
      </SliderControl>
    </Slider>
  );
}
