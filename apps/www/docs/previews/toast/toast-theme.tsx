'use client';

import { Button } from '@/registry/ui/button';
import { toast } from '@/registry/ui/toast';

function showToast(theme: string) {
  toast('Export complete', {
    description: 'Your file is ready to download.',
    theme,
  });
}

export function ToastGray() {
  return (
    <Button variant="outline" onClick={() => showToast('gray')}>
      Export data
    </Button>
  );
}

export function ToastAccent() {
  return (
    <Button variant="outline" onClick={() => showToast('accent')}>
      Export data
    </Button>
  );
}

export function ToastDestructive() {
  return (
    <Button variant="outline" onClick={() => showToast('destructive')}>
      Export data
    </Button>
  );
}

export function ToastWarning() {
  return (
    <Button variant="outline" onClick={() => showToast('warning')}>
      Export data
    </Button>
  );
}

export function ToastSuccess() {
  return (
    <Button variant="outline" onClick={() => showToast('success')}>
      Export data
    </Button>
  );
}

export default ToastGray;
