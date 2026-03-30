'use client';

import * as React from 'react';
import {
  NotePencilIcon as PencilSquareIcon,
  CopySimpleIcon as DocumentDuplicateIcon,
  TrashIcon,
  UserIcon,
  GearIcon as Cog6ToothIcon,
  ShareIcon,
  LinkIcon,
  EnvelopeIcon,
  DeviceMobileIcon as DevicePhoneMobileIcon,
  CaretDownIcon as ChevronDownIcon,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { ComponentDisplay } from './component-display';
import { SelectControl } from './controls';
import { DROPDOWN_VARIANTS, DROPDOWN_THEMES, DROPDOWN_SCENARIOS } from './constants';

type DropdownVariant = (typeof DROPDOWN_VARIANTS)[number];
type DropdownTheme = (typeof DROPDOWN_THEMES)[number];
type DropdownScenario = (typeof DROPDOWN_SCENARIOS)[number];

const VARIANT_OPTIONS = DROPDOWN_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = DROPDOWN_THEMES.map((t) => ({ label: t, value: t }));
const SCENARIO_OPTIONS = [
  { label: 'Basic', value: 'basic' },
  { label: 'With Groups', value: 'with-groups' },
  { label: 'With Checkboxes', value: 'with-checkboxes' },
  { label: 'With Radio', value: 'with-radio' },
  { label: 'With Sub-menu', value: 'with-submenu' },
];

interface ScenarioContentProps {
  variant: DropdownVariant;
  theme: DropdownTheme;
}

function BasicContent({ variant, theme }: ScenarioContentProps) {
  return (
    <DropdownMenuContent variant={variant} theme={theme}>
      <DropdownMenuItem>
        New Text File
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        New File
        <DropdownMenuShortcut>⌘^⌥N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        New Window
        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>New Window with Profile</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>New Profile...</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Save
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        Save as...
        <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem disabled>
        Save All
        <DropdownMenuShortcut>⌥⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Revert File</DropdownMenuItem>
      <DropdownMenuItem>
        Close Editor
        <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>Close Folder [⌘ K F]</DropdownMenuItem>
      <DropdownMenuItem>
        Close Window
        <DropdownMenuShortcut>⇧⌘W</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function WithGroupsContent({ variant, theme }: ScenarioContentProps) {
  return (
    <DropdownMenuContent variant={variant} theme={theme}>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>
          <UserIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Cog6ToothIcon />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>
          <PencilSquareIcon />
          Edit
          <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DocumentDuplicateIcon />
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <TrashIcon />
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function WithCheckboxesContent({ variant, theme }: ScenarioContentProps) {
  const [toolbar, setToolbar] = React.useState(true);
  const [sidebar, setSidebar] = React.useState(false);
  const [statusBar, setStatusBar] = React.useState(true);

  return (
    <DropdownMenuContent variant={variant} theme={theme}>
      <DropdownMenuGroup>
        <DropdownMenuLabel>View</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={toolbar} onCheckedChange={setToolbar}>
          Show Toolbar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={sidebar} onCheckedChange={setSidebar}>
          Show Sidebar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Show Status Bar
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function WithRadioContent({ variant, theme }: ScenarioContentProps) {
  const [appTheme, setAppTheme] = React.useState('system');

  return (
    <DropdownMenuContent variant={variant} theme={theme}>
      <DropdownMenuGroup>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={appTheme} onValueChange={setAppTheme}>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function WithSubmenuContent({ variant, theme }: ScenarioContentProps) {
  return (
    <DropdownMenuContent variant={variant} theme={theme}>
      <DropdownMenuItem>
        <PencilSquareIcon />
        Edit
        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <ShareIcon />
          Share
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>
            <LinkIcon />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EnvelopeIcon />
            Email
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <DevicePhoneMobileIcon />
              Send to app
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Slack</DropdownMenuItem>
              <DropdownMenuItem>Teams</DropdownMenuItem>
              <DropdownMenuItem>Notion</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">
        <TrashIcon />
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function ScenarioContent({
  scenario,
  variant,
  theme,
}: ScenarioContentProps & { scenario: DropdownScenario }) {
  switch (scenario) {
    case 'basic':
      return <BasicContent variant={variant} theme={theme} />;
    case 'with-groups':
      return <WithGroupsContent variant={variant} theme={theme} />;
    case 'with-checkboxes':
      return <WithCheckboxesContent variant={variant} theme={theme} />;
    case 'with-radio':
      return <WithRadioContent variant={variant} theme={theme} />;
    case 'with-submenu':
      return <WithSubmenuContent variant={variant} theme={theme} />;
  }
}

export function DropdownMenuSection() {
  const [variant, setVariant] = React.useState<DropdownVariant>('soft');
  const [theme, setTheme] = React.useState<DropdownTheme>('gray');
  const [scenario, setScenario] = React.useState<DropdownScenario>('basic');

  const preview = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="surface">
            Open menu
            <ChevronDownIcon />
          </Button>
        }
      />
      <ScenarioContent scenario={scenario} variant={variant} theme={theme} />
    </DropdownMenu>
  );

  return (
    <ComponentDisplay
      name="Dropdown Menu"
      slug="dropdown-menu"
      preview={preview}
      controls={
        <>
          <SelectControl
            label="Scenario"
            value={scenario}
            options={SCENARIO_OPTIONS}
            onChange={(v) => setScenario(v as DropdownScenario)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Variant"
            value={variant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setVariant(v as DropdownVariant)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Theme"
            value={theme}
            options={THEME_OPTIONS}
            onChange={(v) => setTheme(v as DropdownTheme)}
          />
        </>
      }
    >
      <div
        className="grid gap-x-6 gap-y-3"
        style={{ gridTemplateColumns: `auto repeat(${DROPDOWN_THEMES.length}, auto)` }}
      >
        <div />
        {DROPDOWN_THEMES.map((t) => (
          <div key={t} className="text-xs font-medium text-foreground-subtle capitalize">
            {t}
          </div>
        ))}

        {DROPDOWN_VARIANTS.map((v) => (
          <React.Fragment key={v}>
            <div className="flex items-center pr-5 text-xs text-foreground-subtle capitalize">
              {v}
            </div>
            {DROPDOWN_THEMES.map((t) => (
              <div key={t} className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="outline" size="sm">
                        Open
                        <ChevronDownIcon />
                      </Button>
                    }
                  />
                  <WithGroupsContent variant={v} theme={t} />
                </DropdownMenu>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </ComponentDisplay>
  );
}
