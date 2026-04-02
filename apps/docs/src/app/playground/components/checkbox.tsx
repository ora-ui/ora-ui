'use client';

import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl, CheckboxControl } from './controls';
import { CHECKBOX_THEMES } from './constants';

type CheckboxTheme = (typeof CHECKBOX_THEMES)[number];

const THEME_OPTIONS = CHECKBOX_THEMES.map((t) => ({ label: t, value: t }));

/* ---------- Checkbox Section ---------- */

export function CheckboxSection() {
  const [theme, setTheme] = React.useState<CheckboxTheme>('accent');
  const [disabled, setDisabled] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);

  const preview = (
    <label className="flex items-center gap-2">
      <Checkbox theme={theme} disabled={disabled} indeterminate={indeterminate} defaultChecked />
      <span className="text-sm text-foreground">Accept terms and conditions</span>
    </label>
  );

  return (
    <ComponentDisplay
      name="Checkbox"
      slug="checkbox"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as CheckboxTheme)}
          />
          <ToolbarSeparator />
          <CheckboxControl label="Disabled" checked={disabled} onChange={setDisabled} />
          <ToolbarSeparator />
          <CheckboxControl
            label="Indeterminate"
            checked={indeterminate}
            onChange={setIndeterminate}
          />
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Overview grid: theme × states */}
        <div
          className="grid items-center gap-x-6 gap-y-3"
          style={{
            gridTemplateColumns: `auto repeat(${CHECKBOX_THEMES.length}, 1fr) auto auto`,
          }}
        >
          <div />
          {CHECKBOX_THEMES.map((t) => (
            <div key={t} className="text-xs font-medium capitalize text-foreground-subtle">
              {t}
            </div>
          ))}
          <div className="text-xs font-medium text-foreground-subtle">disabled</div>
          <div className="text-xs font-medium text-foreground-subtle">indeterminate</div>

          <div className="pr-4 text-xs capitalize text-foreground-subtle">checked</div>
          {CHECKBOX_THEMES.map((t) => (
            <div key={t} className="flex items-center">
              <Checkbox theme={t} defaultChecked />
            </div>
          ))}
          <div className="flex items-center">
            <Checkbox defaultChecked disabled />
          </div>
          <div className="flex items-center">
            <Checkbox indeterminate />
          </div>
        </div>

        {/* States row */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-foreground-subtle">states</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-xs text-foreground-subtle">unchecked</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox defaultChecked />
              <span className="text-xs text-foreground-subtle">checked</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox indeterminate />
              <span className="text-xs text-foreground-subtle">indeterminate</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox disabled />
              <span className="text-xs text-foreground-subtle">disabled</span>
            </label>
          </div>
        </div>
      </div>
    </ComponentDisplay>
  );
}

/* ---------- Checkbox Group Section ---------- */

const FRUIT_OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'mango', label: 'Mango' },
];

function GroupDemo({ theme }: { theme: CheckboxTheme }) {
  const [values, setValues] = React.useState(['apple', 'banana']);

  const allChecked = values.length === FRUIT_OPTIONS.length;
  const someChecked = values.length > 0 && !allChecked;

  function handleParentChange() {
    setValues(allChecked ? [] : FRUIT_OPTIONS.map((f) => f.value));
  }

  return (
    <CheckboxGroup
      value={values}
      onValueChange={setValues}
      allValues={FRUIT_OPTIONS.map((f) => f.value)}
      theme={theme}
    >
      <label className="flex items-center gap-2">
        <Checkbox
          parent
          checked={allChecked}
          indeterminate={someChecked}
          onCheckedChange={handleParentChange}
        />
        <span className="text-sm font-medium text-foreground">Select all</span>
      </label>

      <div className="ml-6 flex flex-col gap-2 border-l border-line-subtle pl-4">
        {FRUIT_OPTIONS.map((fruit) => (
          <label key={fruit.value} className="flex items-center gap-2">
            <Checkbox value={fruit.value} />
            <span className="text-sm text-foreground">{fruit.label}</span>
          </label>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export function CheckboxGroupSection() {
  const [theme, setTheme] = React.useState<CheckboxTheme>('accent');

  return (
    <ComponentDisplay
      name="Checkbox Group"
      slug="checkbox-group"
      preview={<GroupDemo theme={theme} />}
      controls={
        <SelectControl
          label="Theme"
          value={theme}
          options={THEME_OPTIONS}
          onChange={(v) => setTheme(v as CheckboxTheme)}
        />
      }
    >
      <div className="flex flex-wrap gap-12">
        {CHECKBOX_THEMES.map((t) => (
          <div key={t} className="flex flex-col gap-3">
            <p className="text-xs font-medium capitalize text-foreground-subtle">{t}</p>
            <GroupDemo theme={t} />
          </div>
        ))}
      </div>
    </ComponentDisplay>
  );
}
