'use client';

import { Link } from '@/registry/ui/link';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/ui/preview-card';

export default function PreviewCardHero() {
  return (
    <PreviewCard>
      <PreviewCardTrigger render={<Link href="https://ora-ui.com" underline="always" />}>
        Ora UI
      </PreviewCardTrigger>
      <PreviewCardContent className="flex flex-col gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ora-ui_logo.png" alt="" className="h-24 w-full rounded-sm object-contain" />
        <div className="flex flex-col gap-1">
          <p className="font-medium">Ora UI</p>
          <p className="text-secondary">
            Styled primitives and composable patterns for building accessible interfaces.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}
