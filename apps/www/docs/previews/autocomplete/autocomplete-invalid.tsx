'use client';

import { Field, FieldError, FieldLabel } from '@/registry/ui/form';
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

export default function AutocompleteInvalid() {
  return (
    <Field name="tag" invalid className="w-64">
      <FieldLabel>Tag</FieldLabel>
      <Autocomplete items={tags}>
        <AutocompleteInputGroup>
          <AutocompleteInput placeholder="Search tags" />
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
      <FieldError match>Add a tag to continue.</FieldError>
    </Field>
  );
}
