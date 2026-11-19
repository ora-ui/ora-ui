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

export default function PopoverHero() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Notifications</Button>} />
      <PopoverContent showCloseButton>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You are all caught up.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
