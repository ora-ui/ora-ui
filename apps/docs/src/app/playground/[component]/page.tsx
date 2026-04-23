import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getEntryBySlug, getAllEntries } from '../registry';
import { ComponentLoader } from './component-loader';

interface PageProps {
  params: Promise<{ component: string }>;
  searchParams: Promise<Record<string, string>>;
}

export function generateStaticParams() {
  return getAllEntries().map((entry) => ({
    component: entry.slug,
  }));
}

export default async function ComponentPage({ params, searchParams }: PageProps) {
  const { component } = await params;
  const resolvedSearchParams = await searchParams;

  const entry = getEntryBySlug(component);

  if (!entry) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-foreground-subtle">Loading...</div>
        </div>
      }
    >
      <ComponentLoader slug={component} searchParams={resolvedSearchParams} />
    </Suspense>
  );
}
