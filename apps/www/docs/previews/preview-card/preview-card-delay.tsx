'use client';

import { Link } from '@/registry/ui/link';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/ui/preview-card';

export default function PreviewCardDelay() {
  return (
    <PreviewCard>
      <PreviewCardTrigger
        delay={200}
        closeDelay={1000}
        render={<Link href="https://ora-ui.com" underline="always" />}
      >
        Ora UI
      </PreviewCardTrigger>
      <PreviewCardContent className="flex flex-col gap-1">
        <p className="font-medium">Ora UI</p>
        <p className="text-secondary">Opens after 200ms and stays for a second after you leave.</p>
      </PreviewCardContent>
    </PreviewCard>
  );
}
