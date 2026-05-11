'use client';

import * as React from 'react';
import { ExclamationMarkIcon } from '@phosphor-icons/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from '@/registry/ui/alert-dialog';
import { Button } from '@/registry/ui/button';
import { PreviewShell } from '@/playground/components/preview-shell';
import { TextControl, SelectControl, CheckboxControl } from '@/playground/components/controls';
import { ToolbarSeparator } from '@/registry/ui/toolbar';
import { BUTTON_VARIANTS, BUTTON_THEMES } from '@/playground/components/constants';

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type ButtonTheme = (typeof BUTTON_THEMES)[number];

const VARIANT_OPTIONS = BUTTON_VARIANTS.map((v) => ({ label: v, value: v }));
const THEME_OPTIONS = BUTTON_THEMES.map((t) => ({ label: t, value: t }));

export const defaults = {
  actionLabel: 'Delete',
  actionVariant: 'solid',
  actionTheme: 'destructive',
  showIcon: 'true',
};

function AlertDialogPreview({ searchParams }: { searchParams: Record<string, string> }) {
  const [actionLabel, setActionLabel] = React.useState(
    searchParams.actionLabel ?? defaults.actionLabel
  );
  const [actionVariant, setActionVariant] = React.useState<ButtonVariant>(
    (searchParams.actionVariant as ButtonVariant) ?? (defaults.actionVariant as ButtonVariant)
  );
  const [actionTheme, setActionTheme] = React.useState<ButtonTheme>(
    (searchParams.actionTheme as ButtonTheme) ?? (defaults.actionTheme as ButtonTheme)
  );
  const [showIcon, setShowIcon] = React.useState(searchParams.showIcon === 'true');

  const preview = (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Open Alert</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          {showIcon && (
            <AlertDialogMedia>
              <ExclamationMarkIcon />
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={actionVariant} theme={actionTheme}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <PreviewShell
      preview={preview}
      controls={
        <>
          <TextControl label="Action Label" value={actionLabel} onChange={setActionLabel} />
          <ToolbarSeparator />
          <SelectControl
            label="Variant"
            value={actionVariant}
            options={VARIANT_OPTIONS}
            onChange={(v) => setActionVariant(v as ButtonVariant)}
          />
          <ToolbarSeparator />
          <SelectControl
            label="Theme"
            value={actionTheme}
            options={THEME_OPTIONS}
            onChange={(v) => setActionTheme(v as ButtonTheme)}
          />
          <ToolbarSeparator />
          <CheckboxControl label="Show Icon" checked={showIcon} onChange={setShowIcon} />
        </>
      }
      variants={<AlertDialogVariants />}
    />
  );
}

function AlertDialogVariants() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Destructive action</span>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Delete Account</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia>
                <ExclamationMarkIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="solid" theme="destructive">
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Accent action</span>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Save Changes</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save your changes?</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Would you like to save them before leaving this page?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Discard</AlertDialogCancel>
              <AlertDialogAction variant="solid" theme="accent">
                Save Changes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-secondary">Without icon</span>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline">Confirm Action</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm this action</AlertDialogTitle>
              <AlertDialogDescription>
                Please review the details before proceeding. This action will make changes to your
                settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="solid" theme="gray">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

const entry = {
  Preview: AlertDialogPreview,
  Variants: AlertDialogVariants,
  defaults,
};
export default entry;
