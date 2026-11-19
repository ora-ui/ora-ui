'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastTypes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        onClick={() => toast.success('Payment received', { description: 'Invoice 1042 is paid.' })}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Upload failed', { description: 'report.pdf is over 25 MB.' })}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning('Storage almost full', { description: 'You have used 92% of your plan.' })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info('New version available', { description: 'Reload to get the latest changes.' })
        }
      >
        Info
      </Button>
    </div>
  );
}
