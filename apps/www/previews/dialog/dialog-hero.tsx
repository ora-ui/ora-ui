'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/ui/dialog';
import { Button } from '@/registry/ui/button';

export default function DialogHero() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Create playlist</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
          <DialogDescription>
            Give your playlist a name to get started. You can add tracks and update the details at
            any time.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5 px-6">
          <label htmlFor="playlist-name" className="text-sm font-medium text-primary">
            Name
          </label>
          <input
            id="playlist-name"
            placeholder="My playlist"
            className="h-9 w-full rounded-md border border-line-ui bg-ui px-3 text-sm text-primary placeholder:text-muted outline-none focus:ring-2 focus:ring-focus"
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
