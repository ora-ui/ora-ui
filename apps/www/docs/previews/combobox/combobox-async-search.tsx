'use client';

import * as React from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  ComboboxTrigger,
} from '@/registry/ui/combobox';

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

export default function ComboboxAsyncSearch() {
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
    <Combobox items={results} filter={null} onInputValueChange={setQuery}>
      <ComboboxInputGroup className="w-64">
        <ComboboxInput aria-label="Reviewer" placeholder="Assign a reviewer" />
        <ComboboxTrigger />
      </ComboboxInputGroup>
      <ComboboxContent aria-busy={pending || undefined}>
        <ComboboxStatus>{status}</ComboboxStatus>
        <ComboboxEmpty />
        <ComboboxList>
          {(name: string) => (
            <ComboboxItem key={name} value={name}>
              {name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
