import { redirect } from 'next/navigation';
import { getAllEntries } from './registry';

export default function PlaygroundPage() {
  const entries = getAllEntries();
  const firstEntry = entries[0];

  if (firstEntry) {
    redirect(`/playground/${firstEntry.slug}`);
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground">Playground</h1>
        <p className="mt-2 text-sm text-foreground-subtle">No components registered yet.</p>
      </div>
    </div>
  );
}
