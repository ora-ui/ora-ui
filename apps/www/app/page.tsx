'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { SchemaRuntime } from '@/playground/schema/runtime';
import { schemaRegistry } from '@/playground/schema/registry';
import { cn } from '@/registry/lib/utils';

const INTRODUCTION_KEY = '__introduction__';

export default function PlaygroundHome() {
  const [selected, setSelected] = useQueryState(
    'c',
    parseAsString.withDefault(INTRODUCTION_KEY).withOptions({ history: 'replace' })
  );
  const schema = schemaRegistry.find((entry) => entry.component === selected);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full">
      <nav className="w-56 shrink-0 border-r border-line p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-subtle">
          Components
        </div>
        <ul className="flex flex-col gap-0.5">
          <SidebarItem
            label="Introduction"
            active={selected === INTRODUCTION_KEY}
            onClick={() => setSelected(INTRODUCTION_KEY)}
          />
          {schemaRegistry.map((entry) => (
            <SidebarItem
              key={entry.component}
              label={entry.name}
              active={selected === entry.component}
              onClick={() => setSelected(entry.component)}
            />
          ))}
        </ul>
      </nav>

      {schema ? (
        <SchemaRuntime schema={schema} />
      ) : (
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold text-foreground">Introduction</h1>
            <p className="mt-2 text-sm text-foreground-subtle">
              Select a component from the sidebar to start exploring.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({
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
