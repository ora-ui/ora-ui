'use client';

import type { EntrySchema, EntryState, InputSpec } from '@/playground/lib/types';

export function ControlsSidebar({
  schema,
  state,
  setVariant,
  setInput,
}: {
  schema: EntrySchema;
  state: EntryState;
  setVariant: (key: string, value: string) => void;
  setInput: (key: string, value: unknown) => void;
}) {
  const hasContent = schema.content && Object.keys(schema.content).length > 0;

  return (
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
            {Object.entries(schema.content!).map(([key, spec]) => (
              <InputControl
                key={key}
                label={spec.label ?? key}
                spec={spec}
                value={state.inputs[key]}
                disabled={spec.visibleWhen ? !spec.visibleWhen(state.inputs) : false}
                onChange={(value) => setInput(key, value)}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

type InputControlProps = {
  label: string;
  spec: InputSpec;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
};

function InputControl({ label, spec, value, disabled, onChange }: InputControlProps) {
  switch (spec.type) {
    case 'string':
      return (
        <StringInput
          label={label}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case 'boolean':
      return (
        <BooleanInput
          label={label}
          value={value as boolean}
          disabled={disabled}
          onChange={onChange}
        />
      );
    case 'select':
      return (
        <SelectInput
          label={label}
          values={spec.values}
          value={value as string}
          disabled={disabled}
          onChange={onChange}
        />
      );
  }
}

function StringInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-foreground-subtle">{label}</span>
      <input
        type="text"
        disabled={disabled}
        className="rounded-dynamic border border-line-ui bg-ui px-2 py-1 text-sm text-foreground disabled:opacity-40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function BooleanInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        disabled={disabled}
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded disabled:opacity-40"
      />
      <span className="text-foreground-subtle">{label}</span>
    </label>
  );
}

function SelectInput({
  label,
  values,
  value,
  disabled,
  onChange,
}: {
  label: string;
  values: readonly string[];
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-foreground-subtle">{label}</span>
      <select
        disabled={disabled}
        className="rounded-dynamic border border-line-ui bg-ui px-2 py-1 text-sm text-foreground disabled:opacity-40"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );
}
