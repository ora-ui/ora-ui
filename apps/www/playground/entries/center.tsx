import { Center } from '@/registry/ui/center';
import type { EntrySchema } from '@/playground/lib/types';

export const centerEntry: EntrySchema = {
  component: 'center',
  name: 'Center',
  variants: {},
  render: function CenterRender() {
    return (
      <Center className="size-40 rounded-md border border-separator">
        <div className="rounded-sm bg-ui px-4 py-3 text-sm">Centred</div>
      </Center>
    );
  },
};
