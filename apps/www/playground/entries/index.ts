import type { EntrySchema } from '@/playground/lib/types';
import { accordionEntry } from './accordion';
import { buttonEntry } from './button';

export const entries: EntrySchema[] = [accordionEntry, buttonEntry];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
