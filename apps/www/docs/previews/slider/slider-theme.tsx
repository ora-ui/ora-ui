import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export function SliderGray() {
  return (
    <Slider theme="gray" defaultValue={40} className="w-72">
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

export function SliderAccent() {
  return (
    <Slider theme="accent" defaultValue={40} className="w-72">
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

export default SliderGray;
