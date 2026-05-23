import type { EntrySchema } from '@/playground/lib/types';
import { accordionEntry } from './accordion';
import { buttonEntry } from './button';
import { inputEntry } from './input';

export const entries: EntrySchema[] = [accordionEntry, buttonEntry, inputEntry];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
