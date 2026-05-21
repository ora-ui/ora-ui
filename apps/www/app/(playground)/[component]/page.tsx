import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { EntryView } from '@/playground/components/entry-view';
import { entries, getEntryBySlug } from '@/playground/entries';

export function generateStaticParams() {
  return entries.map((entry) => ({ component: entry.component }));
}

export default async function Page({ params }: { params: Promise<{ component: string }> }) {
  const { component } = await params;
  if (!getEntryBySlug(component)) notFound();

  return (
    <Suspense>
      <EntryView slug={component} />
    </Suspense>
  );
}
