'use client';

import * as React from 'react';
import { createParser, useQueryStates, parseAsString, parseAsBoolean, parseAsJson } from 'nuqs';
import type {
  EntrySchema,
  EntryState,
  ListItem,
  NumberSpec,
  VariantSpec,
} from '@/playground/lib/types';

function parseAsStepped({ min, max, step = 1, default: fallback }: NumberSpec) {
  return createParser({
    parse: (raw) => {
      const n = Number.parseFloat(raw);
      if (Number.isNaN(n)) return null;
      return Math.min(max, Math.max(min, min + Math.round((n - min) / step) * step));
    },
    serialize: String,
  }).withDefault(fallback);
}

type EntryParser =
  | ReturnType<typeof parseAsString.withDefault>
  | ReturnType<typeof parseAsBoolean.withDefault>
  | ReturnType<typeof parseAsStepped>
  | ReturnType<ReturnType<typeof parseAsJson<ListItem[]>>['withDefault']>;

function parserFor(spec: VariantSpec | NumberSpec): EntryParser {
  if (!('type' in spec)) return parseAsString.withDefault(spec.default);
  if (spec.type === 'number') return parseAsStepped(spec);
  return parseAsBoolean.withDefault(spec.default);
}

function buildParsers(schema: EntrySchema) {
  const parsers: Record<string, EntryParser> = {};
  const variantKeys: string[] = [];
  const behaviorKeys: string[] = [];
  const inputKeys: string[] = [];

  for (const [key, spec] of Object.entries(schema.variants)) {
    parsers[key] = parserFor(spec);
    variantKeys.push(key);
  }
  if (schema.behavior) {
    for (const [key, spec] of Object.entries(schema.behavior)) {
      parsers[key] = parserFor(spec);
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
    const variants: Record<string, string | boolean> = {};
    for (const key of variantKeys) {
      variants[key] = urlState[key] as string | boolean;
    }
    const behavior: Record<string, string | boolean | number> = {};
    for (const key of behaviorKeys) {
      behavior[key] = urlState[key] as string | boolean | number;
    }
    const inputs: Record<string, unknown> = {};
    for (const key of inputKeys) {
      inputs[key] = urlState[key];
    }
    return { variants, behavior, inputs };
  }, [urlState, variantKeys, behaviorKeys, inputKeys]);

  const setVariant = (key: string, value: string | boolean) => {
    setUrlState({ [key]: value });
  };

  const setBehavior = (key: string, value: string | boolean | number) => {
    setUrlState({ [key]: value });
  };

  const setInput = (key: string, value: unknown) => {
    setUrlState({ [key]: value as string | boolean | ListItem[] });
  };

  return { state, setVariant, setBehavior, setInput };
}
