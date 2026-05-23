'use client';

import { useState } from 'react';
import { CaretDownIcon, MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { Collapsible } from '@base-ui/react/collapsible';
import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';

import { Button } from '@/registry/ui/button';
import type {
  ContentGroup,
  EntrySchema,
  EntryState,
  InputSpec,
  ItemFieldSpec,
  ItemShape,
  ListItem,
  VariantSpec,
} from '@/playground/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select';
import { Input } from '@/registry/ui/input';
import { Label } from '@/registry/ui/label';
import { Switch } from '@/registry/ui/switch';
import { Toggle } from '@/registry/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/ui/tooltip';

export function ControlsSidebar({
  schema,
  state,
  setVariant,
  setBehavior,
  setInput,
}: {
  schema: EntrySchema;
  state: EntryState;
  setVariant: (key: string, value: string | boolean) => void;
  setBehavior: (key: string, value: string | boolean) => void;
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

      {Object.keys(schema.variants).length > 0 && (
        <div className="flex flex-col gap-5 p-(--sidebar-pad)">
          <div className="text-xs font-medium tracking-wide text-foreground-subtle">Variants</div>
          {Object.entries(schema.variants).map(([key, spec]) => (
            <EnumRow
              key={key}
              controlKey={key}
              spec={spec}
              value={state.variants[key]}
              onChange={(value) => setVariant(key, value)}
              allowThemeSwatch
            />
          ))}
        </div>
      )}

      {schema.behavior && Object.keys(schema.behavior).length > 0 && (
        <div className="flex flex-col gap-5 p-(--sidebar-pad)">
          <div className="text-xs font-medium tracking-wide text-foreground-subtle">Behavior</div>
          {Object.entries(schema.behavior).map(([key, spec]) => (
            <EnumRow
              key={key}
              controlKey={key}
              spec={spec}
              value={state.behavior[key]}
              onChange={(value) => setBehavior(key, value)}
            />
          ))}
        </div>
      )}

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

function EnumRow({
  controlKey,
  spec,
  value,
  onChange,
  allowThemeSwatch = false,
}: {
  controlKey: string;
  spec: VariantSpec;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  allowThemeSwatch?: boolean;
}) {
  const label = spec.label ?? controlKey;
  if ('type' in spec) {
    return (
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-xs text-secondary">{label}</span>
        <Switch checked={value === true} onCheckedChange={(next) => onChange(next)} />
      </div>
    );
  }
  const stringValue = value as string;
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-secondary">{label}</span>
      {allowThemeSwatch && controlKey === 'theme' ? (
        <ThemeSwatchInput values={spec.values} value={stringValue} onChange={onChange} />
      ) : spec.values.length === 2 ? (
        <ToggleGroup
          variant="outline"
          value={[stringValue]}
          onValueChange={(next) => {
            const picked = next.find((v) => v !== stringValue) ?? next[0];
            if (picked) onChange(picked);
          }}
        >
          {spec.values.map((v) => (
            <ToggleGroupItem key={v} value={v} className="flex-1 capitalize">
              {v}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      ) : (
        <Select value={stringValue} onValueChange={(v) => onChange(v as string)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent variant="solid">
            {spec.values.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
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
    case 'list':
      return (
        <ListInput
          label={label}
          itemLabel={spec.itemLabel ?? 'Item'}
          itemShape={spec.itemShape}
          value={(value as ListItem[]) ?? []}
          onChange={(next) => onChange(next)}
        />
      );
  }
}

function ListInput({
  label,
  itemLabel,
  itemShape,
  value,
  onChange,
}: {
  label: string;
  itemLabel: string;
  itemShape: ItemShape;
  value: ListItem[];
  onChange: (next: ListItem[]) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const fieldKeys = Object.keys(itemShape);
  const summaryKey = fieldKeys[0];

  const updateItem = (index: number, key: string, fieldValue: string) => {
    const next = value.map((item, i) => (i === index ? { ...item, [key]: fieldValue } : item));
    onChange(next);
  };
  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    setOpenIndex((current) => {
      if (current === null) return null;
      if (current === index) return null;
      if (current > index) return current - 1;
      return current;
    });
  };
  const addItem = () => {
    const fresh: ListItem = {};
    for (const [key, spec] of Object.entries(itemShape)) {
      fresh[key] = spec.default;
    }
    onChange([...value, fresh]);
    setOpenIndex(value.length);
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="text-xs text-secondary">{label}</span>
      <div className="flex flex-col gap-1">
        {value.map((item, index) => {
          const open = openIndex === index;
          const summary = summaryKey ? item[summaryKey] : '';
          const fallback = `${itemLabel} ${index + 1}`;
          return (
            <Collapsible.Root
              key={index}
              open={open}
              onOpenChange={(next) => setOpenIndex(next ? index : null)}
              className="rounded-dynamic border border-line bg-surface"
            >
              <div className="flex items-center">
                <Collapsible.Trigger
                  render={
                    <button
                      type="button"
                      className="flex flex-1 items-center gap-2 rounded-dynamic px-2 py-1.5 text-left text-xs text-primary outline-none transition-colors hover:bg-hover/30 focus-visible:outline-2 focus-visible:outline-focus focus-visible:-outline-offset-2"
                    >
                      <CaretDownIcon
                        className="size-3 shrink-0 text-muted transition-transform duration-150 group-aria-expanded:rotate-180"
                        data-rotate={open ? 'true' : undefined}
                        style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                      />
                      <span className="flex-1 truncate">{summary || fallback}</span>
                    </button>
                  }
                />
                <button
                  type="button"
                  aria-label={`Remove ${itemLabel.toLowerCase()} ${index + 1}`}
                  onClick={() => removeItem(index)}
                  className="mr-1 rounded-dynamic p-1 text-muted outline-none transition-colors hover:bg-hover/30 hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </div>
              <Collapsible.Panel className="overflow-hidden transition-[height] duration-150 data-ending-style:h-0 data-starting-style:h-0 h-(--collapsible-panel-height)">
                <div className="flex flex-col gap-2 border-t border-line p-2">
                  {Object.entries(itemShape).map(([fieldKey, fieldSpec]) => (
                    <ItemFieldInput
                      key={fieldKey}
                      spec={fieldSpec}
                      value={item[fieldKey] ?? fieldSpec.default}
                      onChange={(next) => updateItem(index, fieldKey, next)}
                    />
                  ))}
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
          );
        })}
      </div>
      <Button variant="outline" size="sm" onClick={addItem} className="w-max">
        <PlusIcon /> Add {itemLabel.toLowerCase()}
      </Button>
    </div>
  );
}

function ItemFieldInput({
  spec,
  value,
  onChange,
}: {
  spec: ItemFieldSpec;
  value: string;
  onChange: (next: string) => void;
}) {
  const label = spec.label ?? '';
  if (spec.type === 'select') {
    return (
      <SelectInput
        label={label}
        values={spec.values}
        value={value}
        disabled={false}
        onChange={(next) => onChange(next)}
      />
    );
  }
  return (
    <Label className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-secondary">{label}</span>
      <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </Label>
  );
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
          <Tooltip>
            <TooltipTrigger
              render={
                <span
                  className="size-5 rounded-full outline outline-transparent outline-offset-2 transition-[outline-color] group-data-checked/swatch:outline-primary group-focus-visible/swatch:outline-focus"
                  style={{ backgroundColor: `var(--${v}-fill)` }}
                />
              }
            />
            <TooltipContent>{v.charAt(0).toUpperCase() + v.slice(1)}</TooltipContent>
          </Tooltip>
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
