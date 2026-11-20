import { Flex } from '@/registry/ui/flex';
import type { EntrySchema } from '@/playground/lib/types';

export const flexEntry: EntrySchema = {
  component: 'flex',
  name: 'Flex',
  variants: {},
  render: function FlexRender() {
    return (
      <Flex className="items-center gap-3">
        <div className="rounded-sm bg-ui px-4 py-3 text-sm">One</div>
        <div className="rounded-sm bg-ui px-4 py-3 text-sm">Two</div>
        <div className="rounded-sm bg-ui px-4 py-3 text-sm">Three</div>
      </Flex>
    );
  },
};
