'use client';

import * as React from 'react';

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from '@/registry/ui/autocomplete';

const reviewers = [
  'Ada Lovelace',
  'Alan Turing',
  'Grace Hopper',
  'Katherine Johnson',
  'Margaret Hamilton',
  'Linus Torvalds',
  'Dennis Ritchie',
  'Barbara Liskov',
];

function searchReviewers(query: string) {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(reviewers.filter((name) => name.toLowerCase().includes(query.toLowerCase())));
    }, 600);
  });
}

export default function AutocompleteAsyncSearch() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<string[]>([]);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === '') {
      setResults([]);
      setPending(false);
      return;
    }
    let stale = false;
    setPending(true);
    searchReviewers(trimmed).then((names) => {
      if (stale) return;
      setResults(names);
      setPending(false);
    });
    return () => {
      stale = true;
    };
  }, [query]);

  const trimmed = query.trim();
  const status = pending
    ? 'Searching…'
    : trimmed === ''
      ? 'Start typing to search people.'
      : results.length === 0
        ? `No matches for "${trimmed}".`
        : null;

  return (
    <Autocomplete openOnInputClick items={results} filter={null} onValueChange={setQuery}>
      <AutocompleteInputGroup className="w-64">
        <AutocompleteInput aria-label="Reviewer" placeholder="Assign a reviewer" />
      </AutocompleteInputGroup>
      <AutocompleteContent aria-busy={pending || undefined}>
        <AutocompleteStatus>{status}</AutocompleteStatus>
        <AutocompleteEmpty />
        <AutocompleteList>
          {(name: string) => (
            <AutocompleteItem key={name} value={name}>
              {name}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
