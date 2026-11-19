'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastUpdateInPlace() {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() =>
          toast.success('Draft saved', {
            id: 'replay-success',
            description: 'Click again while this toast is open.',
          })
        }
      >
        Notify
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error('Upload failed', {
            id: 'replay-error',
            description: 'Click again while this toast is open.',
          })
        }
      >
        Fail
      </Button>
    </div>
  );
}
