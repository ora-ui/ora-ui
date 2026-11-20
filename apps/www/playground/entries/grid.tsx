import { Grid } from '@/registry/ui/grid';
import type { EntrySchema } from '@/playground/lib/types';

export const gridEntry: EntrySchema = {
  component: 'grid',
  name: 'Grid',
  variants: {},
  render: function GridRender() {
    return (
      <Grid className="w-72 grid-cols-3 gap-3">
        {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((label) => (
          <div key={label} className="rounded-sm bg-ui px-4 py-3 text-sm">
            {label}
          </div>
        ))}
      </Grid>
    );
  },
};
