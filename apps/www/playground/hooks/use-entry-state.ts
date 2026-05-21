'use client';

import * as React from 'react';
import { useQueryStates, parseAsString, parseAsBoolean } from 'nuqs';
import type { EntrySchema, EntryState } from '@/playground/lib/types';

type EntryParser =
  | ReturnType<typeof parseAsString.withDefault>
  | ReturnType<typeof parseAsBoolean.withDefault>;

function buildParsers(schema: EntrySchema) {
  const parsers: Record<string, EntryParser> = {};
  const variantKeys: string[] = [];
  const inputKeys: string[] = [];

  for (const [key, spec] of Object.entries(schema.variants)) {
    parsers[key] = parseAsString.withDefault(spec.default);
    variantKeys.push(key);
  }
  if (schema.content) {
    for (const [key, spec] of Object.entries(schema.content)) {
      parsers[key] =
        spec.type === 'boolean'
          ? parseAsBoolean.withDefault(spec.default)
          : parseAsString.withDefault(spec.default);
      inputKeys.push(key);
    }
  }

  return { parsers, variantKeys, inputKeys };
}

export function useEntryState(schema: EntrySchema) {
  const { parsers, variantKeys, inputKeys } = React.useMemo(() => buildParsers(schema), [schema]);

  const [urlState, setUrlState] = useQueryStates(parsers, { history: 'replace' });

  const state: EntryState = React.useMemo(() => {
    const variants: Record<string, string> = {};
    for (const key of variantKeys) {
      variants[key] = urlState[key] as string;
    }
    const inputs: Record<string, unknown> = {};
    for (const key of inputKeys) {
      inputs[key] = urlState[key];
    }
    return { variants, inputs };
  }, [urlState, variantKeys, inputKeys]);

  const setVariant = (key: string, value: string) => {
    setUrlState({ [key]: value });
  };

  const setInput = (key: string, value: unknown) => {
    setUrlState({ [key]: value as string | boolean });
  };

  return { state, setVariant, setInput };
}
