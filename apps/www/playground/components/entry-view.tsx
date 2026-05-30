'use client';

import { useEntryState } from '@/playground/hooks/use-entry-state';
import { getEntryBySlug } from '@/playground/entries';
import { ControlsSidebar } from '@/playground/components/controls-sidebar';

export function EntryView({ slug }: { slug: string }) {
  const schema = getEntryBySlug(slug)!;
  const { state, setVariant, setBehavior, setInput } = useEntryState(schema);
  const Render = schema.render;

  return (
    <>
      <div className="flex flex-1 items-center justify-center p-8">
        <Render {...state} />
      </div>
      <ControlsSidebar
        schema={schema}
        state={state}
        setVariant={setVariant}
        setBehavior={setBehavior}
        setInput={setInput}
      />
    </>
  );
}
