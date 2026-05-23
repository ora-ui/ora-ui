'use client';

import * as React from 'react';
import { useQueryStates, parseAsString, parseAsBoolean, parseAsJson } from 'nuqs';
import type { EntrySchema, EntryState, ListItem } from '@/playground/lib/types';

type EntryParser =
  | ReturnType<typeof parseAsString.withDefault>
  | ReturnType<typeof parseAsBoolean.withDefault>
  | ReturnType<ReturnType<typeof parseAsJson<ListItem[]>>['withDefault']>;

function buildParsers(schema: EntrySchema) {
  const parsers: Record<string, EntryParser> = {};
  const variantKeys: string[] = [];
  const behaviorKeys: string[] = [];
  const inputKeys: string[] = [];

  for (const [key, spec] of Object.entries(schema.variants)) {
    parsers[key] = parseAsString.withDefault(spec.default);
    variantKeys.push(key);
  }
  if (schema.behavior) {
    for (const [key, spec] of Object.entries(schema.behavior)) {
      parsers[key] = parseAsString.withDefault(spec.default);
      behaviorKeys.push(key);
    }
  }
  if (schema.content) {
    for (const [key, spec] of Object.entries(schema.content)) {
      if (spec.type === 'boolean') {
        parsers[key] = parseAsBoolean.withDefault(spec.default);
      } else if (spec.type === 'list') {
        parsers[key] = parseAsJson<ListItem[]>((v) => v as ListItem[]).withDefault(
          spec.default as ListItem[]
        );
      } else {
        parsers[key] = parseAsString.withDefault(spec.default);
      }
      inputKeys.push(key);
    }
  }

  return { parsers, variantKeys, behaviorKeys, inputKeys };
}

export function useEntryState(schema: EntrySchema) {
  const { parsers, variantKeys, behaviorKeys, inputKeys } = React.useMemo(
    () => buildParsers(schema),
    [schema]
  );

  const [urlState, setUrlState] = useQueryStates(parsers, { history: 'replace' });

  const state: EntryState = React.useMemo(() => {
    const variants: Record<string, string> = {};
    for (const key of variantKeys) {
      variants[key] = urlState[key] as string;
    }
    const behavior: Record<string, string> = {};
    for (const key of behaviorKeys) {
      behavior[key] = urlState[key] as string;
    }
    const inputs: Record<string, unknown> = {};
    for (const key of inputKeys) {
      inputs[key] = urlState[key];
    }
    return { variants, behavior, inputs };
  }, [urlState, variantKeys, behaviorKeys, inputKeys]);

  const setVariant = (key: string, value: string) => {
    setUrlState({ [key]: value });
  };

  const setBehavior = (key: string, value: string) => {
    setUrlState({ [key]: value });
  };

  const setInput = (key: string, value: unknown) => {
    setUrlState({ [key]: value as string | boolean | ListItem[] });
  };

  return { state, setVariant, setBehavior, setInput };
}
