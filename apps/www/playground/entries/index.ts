import type { EntrySchema } from '@/playground/lib/types';
import { accordionEntry } from './accordion';
import { alertDialogEntry } from './alert-dialog';
import { buttonEntry } from './button';
import { inputEntry } from './input';
import { selectEntry } from './select';
import { toggleEntry } from './toggle';
import { toggleGroupEntry } from './toggle-group';

export const entries: EntrySchema[] = [
  accordionEntry,
  alertDialogEntry,
  buttonEntry,
  inputEntry,
  selectEntry,
  toggleEntry,
  toggleGroupEntry,
];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
