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

function TagAutocomplete({ theme }: { theme: 'gray' | 'accent' }) {
  return (
    <Autocomplete items={tags}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Tag" placeholder="Search tags" />
      </AutocompleteInputGroup>
      <AutocompleteContent theme={theme}>
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

export function AutocompleteGray() {
  return <TagAutocomplete theme="gray" />;
}

export function AutocompleteAccent() {
  return <TagAutocomplete theme="accent" />;
}

export default AutocompleteGray;
