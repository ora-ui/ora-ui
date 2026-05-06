import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';

const GENRES = [
  { value: 'jazz', label: 'Jazz' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hip-hop', label: 'Hip-Hop' },
];

export function Solid() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Pick a genre</p>
      <CheckboxGroup variant="solid" defaultValue={['jazz']}>
        {GENRES.map((genre) => (
          <label key={genre.value} className="flex items-center gap-2">
            <Checkbox value={genre.value} />
            <span className="text-sm text-foreground">{genre.label}</span>
          </label>
        ))}
      </CheckboxGroup>
    </div>
  );
}

export function Surface() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Pick a genre</p>
      <CheckboxGroup variant="surface" defaultValue={['jazz']}>
        {GENRES.map((genre) => (
          <label key={genre.value} className="flex items-center gap-2">
            <Checkbox value={genre.value} />
            <span className="text-sm text-foreground">{genre.label}</span>
          </label>
        ))}
      </CheckboxGroup>
    </div>
  );
}

export default Solid;
