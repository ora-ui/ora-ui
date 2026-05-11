'use client';

import { use, useMemo } from 'react';
import { getEntryBySlug, type PlaygroundComponent } from '@/playground/entries';

interface ComponentLoaderProps {
  slug: string;
  searchParams: Record<string, string>;
}

// Cache promises to avoid recreating them on each render
const promiseCache = new Map<string, Promise<{ default: PlaygroundComponent }>>();

export function ComponentLoader({ slug, searchParams }: ComponentLoaderProps) {
  const entry = getEntryBySlug(slug);

  const loadPromise = useMemo(() => {
    if (!entry) return null;
    if (!promiseCache.has(slug)) {
      promiseCache.set(slug, entry.load());
    }
    return promiseCache.get(slug)!;
  }, [slug, entry]);

  if (!entry || !loadPromise) {
    return null;
  }

  const loaded = use(loadPromise);
  const { Preview, defaults } = loaded.default;
  const mergedParams = { ...defaults, ...searchParams };

  return <Preview searchParams={mergedParams} />;
}
