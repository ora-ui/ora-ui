'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { cn } from '@/registry/lib/utils';
import type { EntrySchema, EntryState, InputSpec } from '@/playground/lib/types';
import { useEntryState } from '@/playground/hooks/use-entry-state';
import { entries, getEntryBySlug } from '@/playground/entries';

const INTRODUCTION_KEY = '__introduction__';

export function PlaygroundLayout() {
  const [selected, setSelected] = useQueryState(
    'c',
    parseAsString.withDefault(INTRODUCTION_KEY).withOptions({ history: 'replace' })
  );
  const schema = getEntryBySlug(selected);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full">
      <NavSidebar selected={selected} onSelect={setSelected} />
      {schema ? <EntryView schema={schema} /> : <IntroductionView />}
    </div>
  );
}

function NavSidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (next: string) => void;
}) {
  return (
    <nav className="w-56 shrink-0 border-r border-line p-4">
      <div className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
        Components
      </div>
      <ul className="flex flex-col gap-0.5">
        <NavItem
          label="Introduction"
          active={selected === INTRODUCTION_KEY}
          onClick={() => onSelect(INTRODUCTION_KEY)}
        />
        {entries.map((entry) => (
          <NavItem
            key={entry.component}
            label={entry.name}
            active={selected === entry.component}
            onClick={() => onSelect(entry.component)}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-full rounded-dynamic px-2 py-1 text-left text-sm',
          active
            ? 'bg-ui text-foreground'
            : 'text-foreground-subtle hover:bg-hover/30 hover:text-foreground'
        )}
      >
        {label}
      </button>
    </li>
  );
}

function EntryView({ schema }: { schema: EntrySchema }) {
  const { state, setVariant, setInput } = useEntryState(schema);

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-8">{schema.render(state)}</div>
      <ControlsSidebar schema={schema} state={state} setVariant={setVariant} setInput={setInput} />
    </>
  );
}

function ControlsSidebar({
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
            {Object.entries(schema.content!).map(([key, spec]) =>
              renderInputControl(key, spec, state.inputs, setInput)
            )}
          </>
        )}
      </div>
    </aside>
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

function IntroductionView() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-foreground">Introduction</h1>
        <p className="mt-2 text-sm text-foreground-subtle">
          Select a component from the sidebar to start exploring.
        </p>
      </div>
    </div>
  );
}
