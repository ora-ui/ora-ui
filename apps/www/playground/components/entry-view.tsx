'use client';

import { useEntryState } from '@/playground/hooks/use-entry-state';
import { getEntryBySlug } from '@/playground/entries';
import { ControlsSidebar } from '@/playground/components/controls-sidebar';

export function EntryView({ slug }: { slug: string }) {
  const schema = getEntryBySlug(slug)!;
  const { state, setVariant, setInput } = useEntryState(schema);

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-8">{schema.render(state)}</div>
      <ControlsSidebar schema={schema} state={state} setVariant={setVariant} setInput={setInput} />
    </>
  );
}
