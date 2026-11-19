'use client';

import * as React from 'react';
import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastUpdateInPlace() {
  const saves = React.useRef(0);

  return (
    <Button
      variant="outline"
      onClick={() => {
        saves.current += 1;
        toast.success('Draft saved', {
          id: 'draft-saved',
          description: `Saved ${saves.current} ${saves.current === 1 ? 'time' : 'times'}.`,
        });
      }}
    >
      Save draft
    </Button>
  );
}
