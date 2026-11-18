import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from '@/registry/ui/slider';

export function SliderSolid() {
  return (
    <Slider variant="solid" defaultValue={40} className="w-72">
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

export function SliderSoft() {
  return (
    <Slider variant="soft" defaultValue={40} className="w-72">
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

export default SliderSolid;
