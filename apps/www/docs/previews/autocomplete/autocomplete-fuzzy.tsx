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

function fuzzyMatch(tag: string, query: string) {
  const text = tag.toLowerCase();
  let position = 0;
  for (const character of query.toLowerCase().replace(/\s/g, '')) {
    position = text.indexOf(character, position);
    if (position === -1) return false;
    position += 1;
  }
  return true;
}

export default function AutocompleteFuzzy() {
  return (
    <Autocomplete items={tags} filter={fuzzyMatch}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Tag" placeholder='Try "prf" or "dsn"' />
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
