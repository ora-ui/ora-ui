import { Input } from '@/registry/ui/input';
import type { EntrySchema } from '@/playground/lib/types';

export const inputEntry: EntrySchema = {
  component: 'input',
  name: 'Input',
  variants: {
    variant: {
      values: ['surface', 'outline', 'soft'],
      label: 'Variant',
      default: 'surface',
    },
  },
  content: {
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      default: 'Enter text...',
    },
    type: {
      type: 'select',
      label: 'Type',
      values: ['text', 'password', 'file'],
      default: 'text',
    },
  },
  render: function InputRender({ variants, inputs }) {
    return (
      <div className="w-full max-w-80">
        <Input
          variant={variants.variant as 'surface' | 'outline' | 'soft'}
          type={inputs.type as 'text' | 'password' | 'file'}
          placeholder={inputs.placeholder as string}
        />
      </div>
    );
  },
};
