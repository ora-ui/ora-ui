'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

export default function ToastStacking() {
  return (
    <Button
      variant="outline"
      onClick={() => {
        toast.success('Invoice sent', { description: 'Sent to accounts@acme.com.' });
        toast.info('Reminder scheduled', { description: 'We will follow up in 3 days.' });
        toast.success('Receipt saved', { description: 'Added to your records.' });
      }}
    >
      Send invoice
    </Button>
  );
}
