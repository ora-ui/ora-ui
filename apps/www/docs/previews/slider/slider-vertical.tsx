import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from '@/registry/ui/slider';

export default function SliderVertical() {
  return (
    <div className="h-48">
      <Slider orientation="vertical" defaultValue={60}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
          </SliderTrack>
          <SliderThumb aria-label="Volume" />
        </SliderControl>
      </Slider>
    </div>
  );
}
