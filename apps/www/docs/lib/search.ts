import { source } from '@/docs/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const searchApi = createFromSource(source);

export async function searchDocs(query: string) {
  return searchApi.search(query);
}
