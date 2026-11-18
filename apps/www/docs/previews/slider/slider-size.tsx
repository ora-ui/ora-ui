import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export function SliderSm() {
  return (
    <Slider size="sm" defaultValue={40} className="w-72">
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

export function SliderMd() {
  return (
    <Slider size="md" defaultValue={40} className="w-72">
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

export function SliderLg() {
  return (
    <Slider size="lg" defaultValue={40} className="w-72">
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

export default SliderSm;
