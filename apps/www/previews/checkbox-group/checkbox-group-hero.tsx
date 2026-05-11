'use client';

import { Checkbox } from '@/registry/ui/checkbox';
import { CheckboxGroup } from '@/registry/ui/checkbox-group';

const GENRES = [
  { value: 'jazz', label: 'Jazz' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hip-hop', label: 'Hip-Hop' },
];

export default function CheckboxGroupHero() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Pick a genre</p>
      <CheckboxGroup defaultValue={['jazz']}>
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
