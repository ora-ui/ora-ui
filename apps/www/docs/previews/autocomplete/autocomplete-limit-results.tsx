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

export default function AutocompleteLimitResults() {
  return (
    <Autocomplete items={tags} limit={5}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Tag" placeholder="Search tags" />
      </AutocompleteInputGroup>
      <AutocompleteContent>
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
