import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export default function SliderSteps() {
  return (
    <Slider defaultValue={30} step={10} className="w-72">
      <SliderLabel>Brightness</SliderLabel>
      <SliderValue />
      <SliderControl>
        <SliderTrack>
          <SliderIndicator />
        </SliderTrack>
        <SliderThumb aria-label="Brightness" />
      </SliderControl>
    </Slider>
  );
}
