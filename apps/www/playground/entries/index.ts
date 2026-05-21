import type { EntrySchema } from '@/playground/lib/types';
import { buttonEntry } from './button';

export const entries: EntrySchema[] = [buttonEntry];

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
