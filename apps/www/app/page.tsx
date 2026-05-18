import { Suspense } from 'react';
import { PlaygroundHome } from './playground-home';

export default function Page() {
  return (
    <Suspense>
      <PlaygroundHome />
    </Suspense>
  );
}
