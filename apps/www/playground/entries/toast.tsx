import type { EntrySchema } from '@/playground/lib/types';
import { ToastRender } from './toast-render';

export const toastEntry: EntrySchema = {
  component: 'toast',
  name: 'Toast',
  variants: {
    variant: {
      values: ['surface', 'soft', 'solid'],
      label: 'Variant',
      default: 'surface',
    },
    theme: {
      values: ['gray', 'accent', 'destructive', 'warning', 'success'],
      label: 'Theme',
      default: 'gray',
    },
  },
  behavior: {
    showAction: { type: 'boolean', label: 'Show action', default: true },
    showClose: { type: 'boolean', label: 'Show close', default: true },
    timeout: {
      values: ['0', '2000', '5000', '10000'],
      label: 'Timeout (ms)',
      default: '5000',
    },
    limit: { values: ['1', '2', '3', '4', '5'], label: 'Limit', default: '3' },
    position: {
      values: ['bottom-right', 'bottom-center', 'top-right', 'top-center'],
      label: 'Position',
      default: 'bottom-right',
    },
  },
  content: {
    title: { type: 'string', label: 'Title', default: 'Export complete' },
    description: {
      type: 'string',
      label: 'Description',
      default: 'Your file is ready to download.',
    },
    actionLabel: { type: 'string', label: 'Action label', default: 'Undo' },
  },
  render: ToastRender,
};
