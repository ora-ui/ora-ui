'use client';

import { Link } from '@/registry/ui/link';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/ui/preview-card';

export default function PreviewCardInline() {
  return (
    <p className="max-w-sm text-sm text-primary">
      Every component in the registry is built on Base UI, so you can read how it works at{' '}
      <PreviewCard>
        <PreviewCardTrigger render={<Link href="https://base-ui.com" underline="always" />}>
          base-ui.com
        </PreviewCardTrigger>
        <PreviewCardContent className="flex flex-col gap-1">
          <p className="font-medium">Base UI</p>
          <p className="text-secondary">
            Unstyled, accessible components for building design systems.
          </p>
        </PreviewCardContent>
      </PreviewCard>{' '}
      before you copy one into your project.
    </p>
  );
}
