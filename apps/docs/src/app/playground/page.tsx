'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  SunIcon,
  MoonIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  LinkIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/16/solid';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Toggle } from '@/components/ui/toggle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar';
import { ButtonGroup } from '@/components/ui/button-group';
import { Toaster } from '@/components/ui/sonner';

const RADIUS_PRESETS = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '0.25rem' },
  { label: 'Medium', value: '0.375rem' },
  { label: 'Large', value: '0.625rem' },
  { label: 'Full', value: '9999px' },
] as const;

const BUTTON_VARIANTS = ['solid', 'outline', 'surface', 'soft', 'ghost'] as const;
const BUTTON_THEMES = ['gray', 'accent', 'destructive'] as const;

const BADGE_VARIANTS = ['solid', 'soft', 'outline', 'surface'] as const;
const BADGE_THEMES = ['gray', 'accent', 'destructive', 'warning', 'success'] as const;

const INPUT_VARIANTS = ['surface', 'outline', 'soft'] as const;
const TEXTAREA_VARIANTS = ['subtle', 'outline', 'soft'] as const;
const KBD_VARIANTS = ['ghost', 'soft', 'surface'] as const;
const TOGGLE_VARIANTS = ['soft', 'outline', 'solid'] as const;
const TOGGLE_SIZES = ['sm', 'md', 'lg'] as const;

const BACKGROUNDS = [
  { label: 'App', value: 'var(--background)' },
  { label: 'Surface 1', value: 'var(--surface-1)' },
  { label: 'Surface 2', value: 'var(--surface-2)' },
] as const;

function BackgroundSwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-line bg-background px-2 py-1 text-xs text-foreground-subtle"
    >
      {BACKGROUNDS.map((bg) => (
        <option key={bg.label} value={bg.value}>
          {bg.label}
        </option>
      ))}
    </select>
  );
}

function ComponentSection({
  name,
  slug,
  background,
  onBackgroundChange,
  children,
}: {
  name: string;
  slug: string;
  background: string;
  onBackgroundChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between" id={slug}>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{name}</h2>
          <Link
            href={`/docs/components/${slug}`}
            className="text-sm text-foreground-subtle hover:text-foreground transition-colors"
          >
            View docs →
          </Link>
        </div>
        <BackgroundSwitcher value={background} onChange={onBackgroundChange} />
      </div>
      <div
        className="rounded-lg border border-line-subtle p-6"
        style={{ backgroundColor: background }}
      >
        {children}
      </div>
    </section>
  );
}

/* ---------- Variant table sections ---------- */

function ButtonSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Button"
      slug="button"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="space-y-8">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `8rem repeat(${BUTTON_THEMES.length + 2}, 1fr)`,
          }}
        >
          <div />
          {BUTTON_THEMES.map((theme) => (
            <div key={theme} className="text-xs font-medium text-foreground-subtle capitalize">
              {theme}
            </div>
          ))}
          <div className="text-xs font-medium text-foreground-subtle">disabled</div>
          <div className="text-xs font-medium text-foreground-subtle">icon</div>

          {BUTTON_VARIANTS.map((variant) => (
            <React.Fragment key={variant}>
              <div className="flex items-center text-sm text-foreground-subtle capitalize">
                {variant}
              </div>
              {BUTTON_THEMES.map((theme) => (
                <div key={theme} className="flex items-center">
                  <Button variant={variant} theme={theme}>
                    {variant}
                  </Button>
                </div>
              ))}
              <div className="flex items-center">
                <Button variant={variant} disabled>
                  {variant}
                </Button>
              </div>
              <div className="flex items-center">
                <Button variant={variant} size="icon">
                  <SunIcon />
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </ComponentSection>
  );
}

function BadgeSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Badge"
      slug="badge"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `8rem repeat(${BADGE_THEMES.length}, 1fr)`,
        }}
      >
        <div />
        {BADGE_THEMES.map((theme) => (
          <div key={theme} className="text-xs font-medium text-foreground-subtle capitalize">
            {theme}
          </div>
        ))}

        {BADGE_VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="flex items-center text-sm text-foreground-subtle capitalize">
              {variant}
            </div>
            {BADGE_THEMES.map((theme) => (
              <div key={theme} className="flex items-center">
                <Badge variant={variant} theme={theme}>
                  Badge
                </Badge>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </ComponentSection>
  );
}

function InputSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Input"
      slug="input"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="grid gap-4 max-w-sm" style={{ gridTemplateColumns: '5rem 1fr' }}>
        {INPUT_VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="flex items-center text-sm text-foreground-subtle capitalize">
              {variant}
            </div>
            <Input variant={variant} placeholder={`${variant} variant`} />
          </React.Fragment>
        ))}
        <div className="flex items-center text-sm text-foreground-subtle">disabled</div>
        <Input disabled placeholder="Disabled" />
      </div>
    </ComponentSection>
  );
}

function TextareaSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Textarea"
      slug="textarea"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="grid gap-4 max-w-sm" style={{ gridTemplateColumns: '5rem 1fr' }}>
        {TEXTAREA_VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="flex items-center text-sm text-foreground-subtle capitalize">
              {variant}
            </div>
            <Textarea variant={variant} placeholder={`${variant} variant`} />
          </React.Fragment>
        ))}
        <div className="flex items-center text-sm text-foreground-subtle">disabled</div>
        <Textarea disabled placeholder="Disabled" />
      </div>
    </ComponentSection>
  );
}

function KbdSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Kbd"
      slug="kbd"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          {KBD_VARIANTS.map((variant) => (
            <div key={variant} className="flex items-center gap-2">
              <span className="text-sm text-foreground-subtle capitalize">{variant}</span>
              <Kbd variant={variant}>⌘</Kbd>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-subtle">Group</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
      </div>
    </ComponentSection>
  );
}

function ToggleSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Toggle"
      slug="toggle"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div
        className="grid gap-4 items-center"
        style={{
          gridTemplateColumns: `5rem repeat(${TOGGLE_SIZES.length}, auto) 1fr`,
        }}
      >
        <div />
        {TOGGLE_SIZES.map((size) => (
          <div key={size} className="text-xs font-medium text-foreground-subtle">
            {size}
          </div>
        ))}
        <div />

        {TOGGLE_VARIANTS.map((variant) => (
          <React.Fragment key={variant}>
            <div className="text-sm text-foreground-subtle capitalize">{variant}</div>
            {TOGGLE_SIZES.map((size) => (
              <div key={size}>
                <Toggle variant={variant} size={size} aria-label="Bold">
                  <BoldIcon />
                </Toggle>
              </div>
            ))}
            <div />
          </React.Fragment>
        ))}
      </div>
    </ComponentSection>
  );
}

function ToggleGroupSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Toggle Group"
      slug="toggle-group"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="space-y-4">
        {TOGGLE_VARIANTS.map((variant) => (
          <div key={variant} className="flex items-center gap-4">
            <span className="w-16 text-sm text-foreground-subtle capitalize">{variant}</span>
            <ToggleGroup variant={variant}>
              <ToggleGroupItem value="bold" aria-label="Bold">
                <BoldIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <ItalicIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <UnderlineIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ))}
      </div>
    </ComponentSection>
  );
}

/* ---------- Size sections ---------- */

function AvatarSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Avatar"
      slug="avatar"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          {(['sm', 'default', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Avatar size={size}>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="text-xs text-foreground-subtle">{size}</span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-2">
            <Avatar>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-xs text-foreground-subtle">fallback</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-subtle">Group</span>
          <AvatarGroup>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>CD</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+3</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </div>
    </ComponentSection>
  );
}

function SwitchSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Switch"
      slug="switch"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-8">
        {(['sm', 'default'] as const).map((size) => (
          <div key={size} className="flex items-center gap-2">
            <Switch size={size} defaultChecked />
            <span className="text-sm text-foreground-subtle">{size}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <Switch disabled />
          <span className="text-sm text-foreground-subtle">disabled</span>
        </div>
      </div>
    </ComponentSection>
  );
}

/* ---------- Example-only sections ---------- */

function AccordionSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Accordion"
      slug="accordion"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="max-w-md">
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              <p>Yes. It comes with default styles that match your theme.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              <p>Yes. It supports open and close animations.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ComponentSection>
  );
}

function CheckboxSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Checkbox"
      slug="checkbox"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-default" defaultChecked />
          <Label htmlFor="checkbox-default">Checked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-unchecked" />
          <Label htmlFor="checkbox-unchecked">Unchecked</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="checkbox-disabled" disabled />
          <Label htmlFor="checkbox-disabled">Disabled</Label>
        </div>
      </div>
    </ComponentSection>
  );
}

function RadioGroupSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Radio Group"
      slug="radio-group"
      background={background}
      onBackgroundChange={setBackground}
    >
      <RadioGroup defaultValue="option-1" className="gap-3">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-1" id="radio-1" />
          <Label htmlFor="radio-1">Option One</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-2" id="radio-2" />
          <Label htmlFor="radio-2">Option Two</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-3" id="radio-3" disabled />
          <Label htmlFor="radio-3">Disabled</Label>
        </div>
      </RadioGroup>
    </ComponentSection>
  );
}

function LabelSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Label"
      slug="label"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-8">
        <Label>Default label</Label>
        <div className="flex items-center gap-2">
          <Label htmlFor="label-input">With input</Label>
          <Input id="label-input" placeholder="Type here..." className="w-48" />
        </div>
      </div>
    </ComponentSection>
  );
}

function SeparatorSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Separator"
      slug="separator"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-foreground-subtle">Horizontal</p>
          <Separator className="my-2" />
          <p className="text-sm text-foreground-subtle">Content below</p>
        </div>
        <div className="flex items-center gap-4 h-6">
          <span className="text-sm text-foreground-subtle">Left</span>
          <Separator orientation="vertical" />
          <span className="text-sm text-foreground-subtle">Right</span>
        </div>
      </div>
    </ComponentSection>
  );
}

function TooltipSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Tooltip"
      slug="tooltip"
      background={background}
      onBackgroundChange={setBackground}
    >
      <TooltipProvider>
        <div className="flex items-center gap-6">
          {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger render={<Button variant="outline">{side}</Button>} />
              <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">With kbd</Button>} />
            <TooltipContent>
              Save <Kbd variant="ghost">⌘S</Kbd>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </ComponentSection>
  );
}

function ToolbarSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Toolbar"
      slug="toolbar"
      background={background}
      onBackgroundChange={setBackground}
    >
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton aria-label="Bold">
            <BoldIcon />
          </ToolbarButton>
          <ToolbarButton aria-label="Italic">
            <ItalicIcon />
          </ToolbarButton>
          <ToolbarButton aria-label="Underline">
            <UnderlineIcon />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton aria-label="Link">
            <LinkIcon />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </ComponentSection>
  );
}

function ButtonGroupSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Button Group"
      slug="button-group"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-8">
        <div className="space-y-2">
          <span className="text-xs text-foreground-subtle">Horizontal</span>
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-foreground-subtle">Vertical</span>
          <ButtonGroup orientation="vertical">
            <Button variant="outline">Top</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Bottom</Button>
          </ButtonGroup>
        </div>
      </div>
    </ComponentSection>
  );
}

function DialogSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Dialog"
      slug="dialog"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ComponentSection>
  );
}

function AlertDialogSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Alert Dialog"
      slug="alert-dialog"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Default</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction theme="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">With Icon</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <ExclamationTriangleIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction theme="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Small</Button>} />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm</AlertDialogTitle>
              <AlertDialogDescription>Are you sure you want to continue?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ComponentSection>
  );
}

function SonnerSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);

  return (
    <ComponentSection
      name="Sonner"
      slug="sonner"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="outline" onClick={() => toast('Event has been created')}>
          Default
        </Button>
        <Button variant="outline" onClick={() => toast.success('Successfully saved!')}>
          Success
        </Button>
        <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
          Error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('Check your input')}>
          Warning
        </Button>
        <Button variant="outline" onClick={() => toast.info('New update available')}>
          Info
        </Button>
      </div>
    </ComponentSection>
  );
}

/* ---------- Dropdown Menu ---------- */

function DropdownMenuSection() {
  const [background, setBackground] = React.useState<string>(BACKGROUNDS[0].value);
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showActivityBar, setShowActivityBar] = React.useState(false);

  return (
    <ComponentSection
      name="Dropdown Menu"
      slug="dropdown-menu"
      background={background}
      onBackgroundChange={setBackground}
    >
      <div className="flex flex-wrap gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">Default</Button>} />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">With Groups</Button>} />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Paste</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Danger Zone</DropdownMenuLabel>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">Checkbox Items</Button>} />
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">With Submenu</Button>} />
          <DropdownMenuContent>
            <DropdownMenuItem>New File</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuItem>Notes</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">Disabled Items</Button>} />
          <DropdownMenuContent>
            <DropdownMenuItem>Active Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" disabled>
              Disabled Destructive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </ComponentSection>
  );
}

/* ---------- Floating Controls ---------- */

function FloatingControls() {
  const { theme, setTheme } = useTheme();
  const [radius, setRadius] = React.useState('0.375rem');

  React.useEffect(() => {
    document.documentElement.style.setProperty('--radius', radius);
    return () => {
      document.documentElement.style.removeProperty('--radius');
    };
  }, [radius]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 rounded-lg border border-line bg-background p-4 shadow-lg">
      <div className="space-y-2">
        <Label className="text-xs text-foreground-subtle">Theme</Label>
        <ToggleGroup
          value={[theme === 'dark' ? 'dark' : 'light']}
          onValueChange={(values) => {
            const next = values[0];
            if (next) setTheme(next);
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="light" aria-label="Light mode">
            <SunIcon className="size-3.5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" aria-label="Dark mode">
            <MoonIcon className="size-3.5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-foreground-subtle">Radius</Label>
        <RadioGroup value={radius} onValueChange={(value) => setRadius(value)} className="gap-2">
          {RADIUS_PRESETS.map((preset) => (
            <div key={preset.value} className="flex items-center gap-2">
              <RadioGroupItem value={preset.value} id={`radius-${preset.label}`} />
              <Label
                htmlFor={`radius-${preset.label}`}
                className="text-xs font-normal cursor-pointer"
              >
                {preset.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl space-y-16 px-6 py-12">
        <div>
          <h1 className="text-3xl font-bold">Playground</h1>
          <p className="mt-2 text-foreground-subtle">
            Overview of all component variants, sizes, and themes.
          </p>
        </div>

        <AccordionSection />
        <AlertDialogSection />
        <AvatarSection />
        <BadgeSection />
        <ButtonSection />
        <ButtonGroupSection />
        <CheckboxSection />
        <DialogSection />
        <DropdownMenuSection />
        <InputSection />
        <KbdSection />
        <LabelSection />
        <RadioGroupSection />
        <SeparatorSection />
        <SonnerSection />
        <SwitchSection />
        <TextareaSection />
        <ToggleSection />
        <ToggleGroupSection />
        <ToolbarSection />
        <TooltipSection />
      </div>

      <Toaster />
      <FloatingControls />
    </div>
  );
}
