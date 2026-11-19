import { Grid } from '@/registry/ui/grid';

export default function GridRender() {
  return (
    <Grid render={<ul />} className="w-72 grid-cols-2 gap-3">
      {['One', 'Two', 'Three', 'Four'].map((label) => (
        <li key={label} className="rounded-sm bg-ui px-4 py-3 text-sm">
          {label}
        </li>
      ))}
    </Grid>
  );
}
