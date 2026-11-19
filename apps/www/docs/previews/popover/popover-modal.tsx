'use client';

import { Button } from '@/registry/ui/button';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/registry/ui/popover';

export default function PopoverModal() {
  return (
    <Popover modal>
      <PopoverTrigger render={<Button variant="outline">Invite teammates</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Invite teammates</PopoverTitle>
          <PopoverDescription>
            Scrolling is locked and focus stays here until you are done.
          </PopoverDescription>
        </PopoverHeader>
        <PopoverClose render={<Button variant="outline">Done</Button>} />
      </PopoverContent>
    </Popover>
  );
}
