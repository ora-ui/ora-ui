import type { EntrySchema } from '@/playground/lib/types';
import { accordionEntry } from './accordion';
import { alertDialogEntry } from './alert-dialog';
import { buttonEntry } from './button';
import { inputEntry } from './input';
import { toggleEntry } from './toggle';

export const entries: EntrySchema[] = [
  accordionEntry,
  alertDialogEntry,
  buttonEntry,
  inputEntry,
  toggleEntry,
];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
