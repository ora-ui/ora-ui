'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/ui/dialog';
import { Button } from '@/registry/ui/button';
import { Kbd, KbdGroup } from '@/registry/ui/kbd';

export default function DialogDefault() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Keyboard shortcuts</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Speed up your workflow with these shortcuts.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 px-6">
          {[
            { keys: ['⌘', 'K'], label: 'Open command menu' },
            { keys: ['⌘', '/'], label: 'Search tracks' },
            { keys: ['Space'], label: 'Play / pause' },
            { keys: ['⌘', '↑'], label: 'Volume up' },
            { keys: ['⌘', '↓'], label: 'Volume down' },
          ].map(({ keys, label }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-primary">{label}</span>
              <KbdGroup>
                {keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </KbdGroup>
            </div>
          ))}
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
