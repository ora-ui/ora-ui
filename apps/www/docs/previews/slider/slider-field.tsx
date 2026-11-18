import { Field, FieldDescription, FieldLabel } from '@/registry/ui/form';
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from '@/registry/ui/slider';

export default function SliderField() {
  return (
    <Field name="volume" className="w-72">
      <FieldLabel>Volume</FieldLabel>
      <Slider defaultValue={40}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
          </SliderTrack>
          <SliderThumb aria-label="Volume" />
        </SliderControl>
      </Slider>
      <FieldDescription>Applies to every device on this account.</FieldDescription>
    </Field>
  );
}
