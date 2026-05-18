'use client';

import * as React from 'react';
import type { EntrySchema, EntryState, InputSpec } from './types';
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

  const setInput = (key: string, value: unknown) => {
    setState((prev) => ({ ...prev, inputs: { ...prev.inputs, [key]: value } }));
  };

  const hasContent = schema.content && Object.keys(schema.content).length > 0;

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

          {hasContent && (
            <>
              <div className="border-t border-line pt-3 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
                Content
              </div>
              {Object.entries(schema.content!).map(([key, spec]) =>
                renderInputControl(key, spec, state.inputs, setInput)
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function renderInputControl(
  key: string,
  spec: InputSpec,
  inputs: Record<string, unknown>,
  setInput: (key: string, value: unknown) => void
) {
  const disabled = spec.visibleWhen ? !spec.visibleWhen(inputs) : false;

  if (spec.type === 'string') {
    return (
      <label key={key} className="flex flex-col gap-1 text-sm">
        <span className="text-foreground-subtle">{spec.label ?? key}</span>
        <input
          type="text"
          disabled={disabled}
          className="rounded-dynamic border border-line-ui bg-ui px-2 py-1 text-sm text-foreground disabled:opacity-40"
          value={inputs[key] as string}
          onChange={(e) => setInput(key, e.target.value)}
        />
      </label>
    );
  }

  if (spec.type === 'boolean') {
    return (
      <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          disabled={disabled}
          checked={inputs[key] as boolean}
          onChange={(e) => setInput(key, e.target.checked)}
          className="rounded disabled:opacity-40"
        />
        <span className="text-foreground-subtle">{spec.label ?? key}</span>
      </label>
    );
  }

  if (spec.type === 'select') {
    return (
      <label key={key} className="flex flex-col gap-1 text-sm">
        <span className="text-foreground-subtle">{spec.label ?? key}</span>
        <select
          disabled={disabled}
          className="rounded-dynamic border border-line-ui bg-ui px-2 py-1 text-sm text-foreground disabled:opacity-40"
          value={inputs[key] as string}
          onChange={(e) => setInput(key, e.target.value)}
        >
          {spec.values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return null;
}
