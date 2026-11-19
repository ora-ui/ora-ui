'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastHero() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('Export complete', {
          description: 'Your file is ready to download.',
        })
      }
    >
      Export data
    </Button>
  );
}
