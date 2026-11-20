'use client';

import NextLink from 'next/link';
import { buttonVariants } from '@/registry/ui/button';

export function OpenInPlayground({ component }: { component: string }) {
  return (
    <NextLink href={`/playground/${component}`} className={buttonVariants({ variant: 'surface' })}>
      Open in Playground
    </NextLink>
  );
}
