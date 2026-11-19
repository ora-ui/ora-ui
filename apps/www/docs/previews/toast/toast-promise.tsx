'use client';

import * as React from 'react';
import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastPromise() {
  const attempts = React.useRef(0);

  return (
    <Button
      variant="outline"
      onClick={() => {
        attempts.current += 1;
        const fails = attempts.current % 2 === 0;
        toast
          .promise(
            new Promise<string>((resolve, reject) =>
              setTimeout(
                () => (fails ? reject(new Error('Network error')) : resolve('draft')),
                2000
              )
            ),
            {
              loading: 'Saving changes',
              success: 'Changes saved',
              error: (error: Error) => ({
                title: 'Could not save changes',
                description: error.message,
              }),
            }
          )
          .catch(() => {});
      }}
    >
      Save changes
    </Button>
  );
}
