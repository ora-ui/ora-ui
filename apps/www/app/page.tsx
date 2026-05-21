import { Suspense } from 'react';
import { PlaygroundLayout } from '@/playground/components/layout';

export default function Page() {
  return (
    <Suspense>
      <PlaygroundLayout />
    </Suspense>
  );
}
