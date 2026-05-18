'use client';

import * as React from 'react';
import type { EntrySchema, EntryState } from './types';
import { defaultState } from './types';

interface SchemaRuntimeProps {
  schema: EntrySchema;
}

export function SchemaRuntime({ schema }: SchemaRuntimeProps) {
  const [state, setState] = React.useState<EntryState>(() => defaultState(schema));

  React.useEffect(() => {
    setState(defaultState(schema));
  }, [schema]);

  const setVariant = (key: string, value: string) => {
    setState((prev) => ({ ...prev, variants: { ...prev.variants, [key]: value } }));
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-8">{schema.render(state)}</div>
      <aside className="w-64 shrink-0 border-l border-line p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
          {schema.name}
        </div>
        <div className="flex flex-col gap-3">
          {Object.entries(schema.variants).map(([key, spec]) => (
            <label key={key} className="flex flex-col gap-1 text-sm">
              <span className="text-foreground-subtle">{spec.label ?? key}</span>
              <select
                className="rounded-dynamic border border-line-ui bg-ui px-2 py-1 text-sm text-foreground"
                value={state.variants[key]}
                onChange={(e) => setVariant(key, e.target.value)}
              >
                {spec.values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </aside>
    </>
  );
}
