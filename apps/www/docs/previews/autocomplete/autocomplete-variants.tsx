'use client';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
} from '@/registry/ui/autocomplete';

const tags = [
  'Accessibility',
  'Animation',
  'Bug fix',
  'Design system',
  'Documentation',
  'Performance',
  'Refactor',
  'Security',
  'Testing',
  'Typography',
];

function TagAutocomplete({ variant }: { variant: 'soft' | 'solid' }) {
  return (
    <Autocomplete items={tags}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Tag" placeholder="Search tags" />
      </AutocompleteInputGroup>
      <AutocompleteContent variant={variant}>
        <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
        <AutocompleteList>
          {(tag: string) => (
            <AutocompleteItem key={tag} value={tag}>
              {tag}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

export function AutocompleteSoft() {
  return <TagAutocomplete variant="soft" />;
}

export function AutocompleteSolid() {
  return <TagAutocomplete variant="solid" />;
}

export default AutocompleteSoft;
