'use client';

import { use, useMemo } from 'react';
import { getEntryBySlug, type PlaygroundComponent } from '../registry';

interface ComponentLoaderProps {
  slug: string;
  searchParams: Record<string, string>;
}

// Cache promises to avoid recreating them on each render
const promiseCache = new Map<string, Promise<{ default: PlaygroundComponent }>>();

export function ComponentLoader({ slug, searchParams }: ComponentLoaderProps) {
  const entry = getEntryBySlug(slug);

  if (!entry) {
    return null;
  }

  // Cache the promise per slug to keep it stable across renders
  const loadPromise = useMemo(() => {
    if (!promiseCache.has(slug)) {
      promiseCache.set(slug, entry.load());
    }
    return promiseCache.get(slug)!;
  }, [slug, entry]);

  // React's use() hook unwraps the cached promise
  const module = use(loadPromise);
  const { Preview, defaults } = module.default;
  const mergedParams = { ...defaults, ...searchParams };

  return <Preview searchParams={mergedParams} />;
}
