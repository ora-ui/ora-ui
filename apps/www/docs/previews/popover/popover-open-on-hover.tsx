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

export default function PopoverOpenOnHover() {
  return (
    <Popover>
      <PopoverTrigger openOnHover render={<Button variant="outline">Notifications</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Notifications</PopoverTitle>
          <PopoverDescription>You are all caught up.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}
