'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function EditMenu({ variant }: { variant: 'soft' | 'solid' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Edit</Button>} />
      <DropdownMenuContent align="start" variant={variant}>
        <DropdownMenuGroup>
          <DropdownMenuItem>Cut</DropdownMenuItem>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Paste</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Find</DropdownMenuItem>
          <DropdownMenuItem>Select all</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Soft() {
  return <EditMenu variant="soft" />;
}

export function Solid() {
  return <EditMenu variant="solid" />;
}

export default Soft;
