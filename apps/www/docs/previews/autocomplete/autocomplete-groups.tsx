'use client';

import * as React from 'react';

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
} from '@/registry/ui/autocomplete';

interface TagGroup {
  label: string;
  items: string[];
}

const tagGroups: TagGroup[] = [
  { label: 'Quality', items: ['Accessibility', 'Performance', 'Security', 'Testing'] },
  { label: 'Craft', items: ['Animation', 'Design system', 'Typography'] },
  { label: 'Maintenance', items: ['Bug fix', 'Documentation', 'Refactor'] },
];

export default function AutocompleteGroups() {
  return (
    <Autocomplete items={tagGroups}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Tag" placeholder="Search tags" />
      </AutocompleteInputGroup>
      <AutocompleteContent>
        <AutocompleteEmpty>No tags found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group: TagGroup, index: number) => (
            <React.Fragment key={group.label}>
              {index > 0 && <AutocompleteSeparator />}
              <AutocompleteGroup items={group.items}>
                <AutocompleteLabel>{group.label}</AutocompleteLabel>
                <AutocompleteCollection>
                  {(tag: string) => (
                    <AutocompleteItem key={tag} value={tag}>
                      {tag}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
              </AutocompleteGroup>
            </React.Fragment>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
