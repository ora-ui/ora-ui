'use client';

import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import type { EntrySchema, EntryState, InputSpec } from '@/playground/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select';

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
          <div key={key} className="flex flex-col gap-1 text-sm">
            <span className="text-foreground-subtle">{spec.label ?? key}</span>
            {key === 'theme' ? (
              <ThemeSwatchInput
                values={spec.values}
                value={state.variants[key]}
                onChange={(value) => setVariant(key, value)}
              />
            ) : (
              <Select
                value={state.variants[key]}
                onValueChange={(value) => setVariant(key, value as string)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {spec.values.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
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

function ThemeSwatchInput({
  values,
  value,
  onChange,
}: {
  values: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroupPrimitive
      value={value}
      onValueChange={(next) => onChange(next as string)}
      className="flex flex-wrap gap-1"
    >
      {values.map((v) => (
        <RadioPrimitive.Root
          key={v}
          value={v}
          aria-label={v}
          className="group/swatch flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none"
        >
          <span
            className="size-5 rounded-full outline outline-transparent outline-offset-2 transition-[outline-color] group-data-checked/swatch:outline-primary group-focus-visible/swatch:outline-focus"
            style={{ backgroundColor: `var(--${v}-fill)` }}
          />
        </RadioPrimitive.Root>
      ))}
    </RadioGroupPrimitive>
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
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-foreground-subtle">{label}</span>
      <Select value={value} onValueChange={(next) => onChange(next as string)} disabled={disabled}>
        <SelectTrigger className="w-full disabled:opacity-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {values.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
