import type { EntrySchema } from './types';
import { buttonEntry } from './entries/button';

export const schemaRegistry: EntrySchema[] = [buttonEntry];

export function getSchemaBySlug(slug: string): EntrySchema | undefined {
  return schemaRegistry.find((entry) => entry.component === slug);
}
