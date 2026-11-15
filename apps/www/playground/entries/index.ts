import type { EntrySchema } from '@/playground/lib/types';
import { entries } from './entries.generated';

export { entries };

export function getEntryBySlug(slug: string): EntrySchema | undefined {
  return entries.find((entry) => entry.component === slug);
}
