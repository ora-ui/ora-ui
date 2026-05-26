import type { EntrySchema } from '@/playground/lib/types';
import { accordionEntry } from './accordion';
import { alertDialogEntry } from './alert-dialog';
import { buttonEntry } from './button';
import { inputEntry } from './input';
import { toggleEntry } from './toggle';
import { toggleGroupEntry } from './toggle-group';

export const entries: EntrySchema[] = [
  accordionEntry,
  alertDialogEntry,
  buttonEntry,
  inputEntry,
  toggleEntry,
  toggleGroupEntry,
];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
