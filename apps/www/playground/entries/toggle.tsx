import type { EntrySchema } from '@/playground/lib/types';
import { ToggleRender } from './toggle-render';

export const toggleEntry: EntrySchema = {
  component: 'toggle',
  name: 'Toggle',
  variants: {
    variant: {
      values: ['soft', 'outline', 'surface', 'ghost', 'solid'],
      label: 'Variant',
      default: 'soft',
    },
    theme: {
      values: ['gray', 'accent'],
      label: 'Theme',
      default: 'gray',
    },
  },
  content: {
    label: {
      type: 'string',
      label: 'Label',
      default: 'Like',
    },
    icon: {
      type: 'boolean',
      label: 'Icon',
      default: false,
    },
    iconPosition: {
      type: 'select',
      label: 'Position',
      values: ['leading', 'trailing'],
      default: 'leading',
      visibleWhen: (inputs) => inputs.icon === true && Boolean(inputs.label),
    },
  },
  groups: [
    {
      label: 'Icon',
      toggleKey: 'icon',
      children: ['iconPosition'],
    },
  ],
  render: ToggleRender,
};
