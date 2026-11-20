import { Box } from '@/registry/ui/box';
import type { EntrySchema } from '@/playground/lib/types';

export const boxEntry: EntrySchema = {
  component: 'box',
  name: 'Box',
  variants: {},
  render: function BoxRender() {
    return (
      <Box className="w-64 rounded-md border border-separator p-4 text-sm">
        A Box is a div. Style it with className.
      </Box>
    );
  },
};
