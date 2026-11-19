'use client';

import * as React from 'react';
import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastAction() {
  const [deleted, setDeleted] = React.useState(false);

  return (
    <div className="flex w-72 items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm">
      {deleted ? (
        <span className="text-secondary">Nothing here</span>
      ) : (
        <>
          <span>quarterly-report.pdf</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDeleted(true);
              toast('File deleted', {
                description: 'quarterly-report.pdf was moved to trash.',
                actionProps: { children: 'Undo', onClick: () => setDeleted(false) },
              });
            }}
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
}
