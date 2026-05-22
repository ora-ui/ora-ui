'use client';

import { MinusIcon, PlusIcon } from '@phosphor-icons/react';
import { Collapsible } from '@base-ui/react/collapsible';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { Button } from '@/registry/ui/button';
import type { ContentGroup, EntrySchema, EntryState, InputSpec } from '@/playground/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select';
import { Input } from '@/registry/ui/input';
import { Label } from '@/registry/ui/label';
import { Toggle } from '@/registry/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';

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
  const groups = schema.groups ?? [];
  const groupedKeys = new Set(groups.flatMap((g) => [g.toggleKey, ...g.children]));
  const ungroupedEntries = Object.entries(schema.content ?? {}).filter(
    ([key]) => !groupedKeys.has(key)
  );
  const hasUngrouped = ungroupedEntries.length > 0;

  return (
    <aside className="w-64 shrink-0 border-l border-line [--sidebar-pad:--spacing(3)] *:border-b *:border-line">
      <div className="flex items-center justify-between gap-2 bg-surface p-(--sidebar-pad)">
        <h3 className="text-sm font-medium tracking-wide text-foreground-subtle">{schema.name}</h3>
        <Button size="sm">Get code</Button>
      </div>

      <div className="flex flex-col gap-5 p-(--sidebar-pad)">
        <div className="text-xs font-medium tracking-wide text-foreground-subtle">Variants</div>
        {Object.entries(schema.variants).map(([key, spec]) => (
          <div key={key} className="flex flex-col gap-1 text-sm">
            <span className="text-xs text-secondary">{spec.label ?? key}</span>
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
                <SelectContent variant="solid">
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
      </div>

      {hasUngrouped && (
        <div className="flex flex-col gap-5 p-(--sidebar-pad)">
          <div className="text-xs font-medium tracking-wide text-foreground-subtle">Content</div>
          {ungroupedEntries.map(([key, spec]) => (
            <InputControl
              key={key}
              label={spec.label ?? key}
              spec={spec}
              value={state.inputs[key]}
              disabled={spec.visibleWhen ? !spec.visibleWhen(state.inputs) : false}
              onChange={(value) => setInput(key, value)}
            />
          ))}
        </div>
      )}

      {groups.map((group) => (
        <GroupSection
          key={group.toggleKey}
          group={group}
          content={schema.content ?? {}}
          state={state}
          setInput={setInput}
        />
      ))}
    </aside>
  );
}

function GroupSection({
  group,
  content,
  state,
  setInput,
}: {
  group: ContentGroup;
  content: Record<string, InputSpec>;
  state: EntryState;
  setInput: (key: string, value: unknown) => void;
}) {
  const open = state.inputs[group.toggleKey] === true;
  const childEntries = group.children
    .map((key) => [key, content[key]] as const)
    .filter(([, spec]) => spec !== undefined);

  return (
    <Collapsible.Root open={open} onOpenChange={(next) => setInput(group.toggleKey, next)}>
      <Collapsible.Trigger
        render={
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 p-(--sidebar-pad) text-sm text-primary outline-none transition-colors hover:bg-hover/30 focus-visible:outline-2 focus-visible:outline-focus focus-visible:-outline-offset-2"
          >
            <span className="text-xs font-medium tracking-wide text-foreground-subtle">
              {group.label}
            </span>
            {open ? (
              <MinusIcon className="size-4 text-muted" />
            ) : (
              <PlusIcon className="size-4 text-muted" />
            )}
          </button>
        }
      />
      <Collapsible.Panel className="overflow-hidden data-ending-style:h-0 data-starting-style:h-0 transition-[height] duration-150 h-(--collapsible-panel-height)">
        <div className="flex flex-col gap-5 p-(--sidebar-pad)">
          {childEntries.map(([key, spec]) => (
            <InputControl
              key={key}
              label={spec.label ?? key}
              spec={spec}
              value={state.inputs[key]}
              disabled={spec.visibleWhen ? !spec.visibleWhen(state.inputs) : false}
              onChange={(value) => setInput(key, value)}
            />
          ))}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
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
    <Label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-secondary">{label}</span>
      <Input
        type="text"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Label>
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
    <Toggle
      // variant="outline"
      // size="sm"
      pressed={value}
      disabled={disabled}
      onPressedChange={onChange}
      className="w-max justify-start"
    >
      {value ? <MinusIcon /> : <PlusIcon />}
      {value ? `Remove ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
    </Toggle>
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
          className="group/swatch flex size-6 shrink-0 items-center justify-center rounded-full outline-none"
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
      <span className="text-xs text-secondary">{label}</span>
      <ToggleGroup
        variant="outline"
        value={[value]}
        onValueChange={(next) => {
          const picked = next.find((v) => v !== value) ?? next[0];
          if (picked) onChange(picked);
        }}
        disabled={disabled}
      >
        {values.map((v) => (
          <ToggleGroupItem key={v} value={v} className="flex-1 capitalize">
            {v}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
