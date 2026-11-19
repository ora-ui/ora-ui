'use client';

import { Button } from '@/registry/ui/button';
import { toast, type ToastVariant } from '@/registry/ui/toast';

function showToast(variant: ToastVariant) {
  toast.success('Export complete', {
    description: 'Your file is ready to download.',
    variant,
  });
}

export function ToastSurface() {
  return (
    <Button variant="outline" onClick={() => showToast('surface')}>
      Export data
    </Button>
  );
}

export function ToastSoft() {
  return (
    <Button variant="outline" onClick={() => showToast('soft')}>
      Export data
    </Button>
  );
}

export function ToastSolid() {
  return (
    <Button variant="outline" onClick={() => showToast('solid')}>
      Export data
    </Button>
  );
}

export default ToastSurface;
