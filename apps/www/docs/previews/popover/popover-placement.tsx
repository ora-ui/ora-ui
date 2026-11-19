'use client';

import { Button } from '@/registry/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/registry/ui/popover';

type Side = 'top' | 'right' | 'bottom' | 'left';

function PopoverOnSide({ side }: { side: Side }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Notifications</Button>} />
      <PopoverContent side={side}>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You are all caught up.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

export function PopoverTop() {
  return <PopoverOnSide side="top" />;
}

export function PopoverRight() {
  return <PopoverOnSide side="right" />;
}

export function PopoverBottom() {
  return <PopoverOnSide side="bottom" />;
}

export function PopoverLeft() {
  return <PopoverOnSide side="left" />;
}

export default PopoverBottom;
