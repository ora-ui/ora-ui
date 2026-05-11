'use client';

import { Button } from '@/registry/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/registry/ui/dropdown-menu';

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

export function DropdownMenuSoft() {
  return <EditMenu variant="soft" />;
}

export function DropdownMenuSolid() {
  return <EditMenu variant="solid" />;
}

export default DropdownMenuSoft;
