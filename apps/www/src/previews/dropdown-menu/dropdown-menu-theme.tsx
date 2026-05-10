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

function EditMenu({ theme }: { theme: 'gray' | 'accent' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Edit</Button>} />
      <DropdownMenuContent align="start" theme={theme}>
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

export function Gray() {
  return <EditMenu theme="gray" />;
}

export function Accent() {
  return <EditMenu theme="accent" />;
}

export default Gray;
