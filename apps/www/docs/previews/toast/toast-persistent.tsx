'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastPersistent() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.info('Update available', {
          description: 'Reload the page to get the latest version.',
          timeout: 0,
        })
      }
    >
      Check for updates
    </Button>
  );
}
