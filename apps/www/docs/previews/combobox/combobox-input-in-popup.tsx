'use client';

import { Button } from '@/registry/ui/button';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/registry/ui/combobox';

const countries = [
  'Australia',
  'Brazil',
  'Canada',
  'France',
  'Germany',
  'India',
  'Japan',
  'Mexico',
  'Spain',
  'United Kingdom',
];

export default function ComboboxInputInPopup() {
  return (
    <Combobox items={countries}>
      <ComboboxTrigger
        render={<Button variant="outline" className="w-56 justify-between font-normal" />}
        aria-label="Country"
      >
        <ComboboxValue placeholder="Select a country" />
        <ComboboxIcon />
      </ComboboxTrigger>
      <ComboboxContent aria-label="Select a country" className="min-w-56">
        <ComboboxInputGroup>
          <ComboboxInput aria-label="Search countries" placeholder="Search countries" />
        </ComboboxInputGroup>
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
