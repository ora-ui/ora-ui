import { ExclamationMarkIcon } from '@phosphor-icons/react/dist/ssr';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/ui/alert-dialog';
import { Button } from '@/registry/ui/button';
import type { EntrySchema } from '@/playground/lib/types';

export const alertDialogEntry: EntrySchema = {
  component: 'alert-dialog',
  name: 'Alert Dialog',
  variants: {},
  content: {
    title: {
      type: 'string',
      label: 'Title',
      default: 'Are you absolutely sure?',
    },
    description: {
      type: 'string',
      label: 'Description',
      default:
        'This action cannot be undone. This will permanently delete your account and remove your data from our servers.',
    },
    actionLabel: {
      type: 'string',
      label: 'Action',
      default: 'Delete Account',
    },
    cancelLabel: {
      type: 'string',
      label: 'Cancel',
      default: 'Cancel',
    },
    media: {
      type: 'boolean',
      label: 'Media',
      default: false,
    },
    mediaTheme: {
      type: 'select',
      label: 'Theme',
      values: ['gray', 'destructive'],
      default: 'gray',
      visibleWhen: (inputs) => inputs.media === true,
    },
  },
  groups: [
    {
      label: 'Media',
      toggleKey: 'media',
      children: ['mediaTheme'],
    },
  ],
  render: function AlertDialogRender({ inputs }) {
    const title = inputs.title as string;
    const description = inputs.description as string;
    const actionLabel = inputs.actionLabel as string;
    const cancelLabel = inputs.cancelLabel as string;
    const media = inputs.media as boolean;
    const mediaTheme = inputs.mediaTheme as 'gray' | 'destructive';

    return (
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline">{actionLabel}</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            {media && (
              <AlertDialogMedia
                className={
                  mediaTheme === 'destructive'
                    ? 'bg-(--destructive-ui) text-(--destructive-fill)'
                    : undefined
                }
              >
                <ExclamationMarkIcon />
              </AlertDialogMedia>
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction variant="solid" theme="destructive">
              {actionLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};
