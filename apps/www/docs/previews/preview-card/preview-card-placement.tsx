'use client';

import { Link } from '@/registry/ui/link';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/ui/preview-card';

type Side = 'top' | 'right' | 'bottom' | 'left';

function PreviewCardOnSide({ side }: { side: Side }) {
  return (
    <PreviewCard>
      <PreviewCardTrigger render={<Link href="https://ora-ui.com" underline="always" />}>
        Ora UI
      </PreviewCardTrigger>
      <PreviewCardContent side={side} className="flex flex-col gap-1">
        <p className="font-medium">Ora UI</p>
        <p className="text-secondary">
          Styled primitives and composable patterns for building accessible interfaces.
        </p>
      </PreviewCardContent>
    </PreviewCard>
  );
}

export function PreviewCardTop() {
  return <PreviewCardOnSide side="top" />;
}

export function PreviewCardRight() {
  return <PreviewCardOnSide side="right" />;
}

export function PreviewCardBottom() {
  return <PreviewCardOnSide side="bottom" />;
}

export function PreviewCardLeft() {
  return <PreviewCardOnSide side="left" />;
}

export default PreviewCardBottom;
