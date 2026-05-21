import { StarIcon } from '@phosphor-icons/react/dist/ssr';
import { Button } from '@/registry/ui/button';
import type { EntrySchema } from '@/playground/lib/types';

export const buttonEntry: EntrySchema = {
  component: 'button',
  name: 'Button',
  variants: {
    variant: {
      values: ['solid', 'outline', 'surface', 'soft', 'ghost'],
      label: 'Variant',
      default: 'solid',
    },
    theme: {
      values: ['gray', 'accent', 'destructive'],
      label: 'Theme',
      default: 'gray',
    },
  },
  content: {
    label: {
      type: 'string',
      label: 'Label',
      default: 'Button',
    },
    icon: {
      type: 'boolean',
      label: 'Icon',
      default: false,
    },
    iconPosition: {
      type: 'select',
      label: 'Icon Position',
      values: ['leading', 'trailing'],
      default: 'leading',
      visibleWhen: (inputs) => inputs.icon === true && Boolean(inputs.label),
    },
  },
  render: ({ variants, inputs }) => {
    const label = inputs.label as string;
    const icon = inputs.icon as boolean;
    const iconPosition = inputs.iconPosition as 'leading' | 'trailing';

    return (
      <Button
        variant={variants.variant as 'solid' | 'outline' | 'surface' | 'soft' | 'ghost'}
        theme={variants.theme as 'gray' | 'accent' | 'destructive'}
      >
        {icon && iconPosition === 'leading' && <StarIcon />}
        {label}
        {icon && iconPosition === 'trailing' && <StarIcon />}
      </Button>
    );
  },
};
