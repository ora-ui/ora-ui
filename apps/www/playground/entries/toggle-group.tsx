import type { EntrySchema } from '@/playground/lib/types';
import { ToggleGroupRender } from './toggle-group-render';

export const toggleGroupEntry: EntrySchema = {
  component: 'toggle-group',
  name: 'Toggle Group',
  variants: {
    variant: {
      values: ['none', 'outline', 'surface', 'soft', 'solid'],
      label: 'Container',
      default: 'none',
    },
    itemVariant: {
      values: ['soft', 'outline', 'surface', 'ghost', 'solid', 'on-solid'],
      label: 'Item',
      default: 'soft',
    },
    orientation: {
      values: ['horizontal', 'vertical'],
      label: 'Orientation',
      default: 'horizontal',
    },
  },
  behavior: {
    attached: {
      values: ['false', 'true'],
      label: 'Attached',
      default: 'false',
    },
    multiple: {
      values: ['false', 'true'],
      label: 'Multiple',
      default: 'false',
    },
  },
  render: ToggleGroupRender,
};
