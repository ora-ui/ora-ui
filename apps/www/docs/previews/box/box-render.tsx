import { Box } from '@/registry/ui/box';

export default function BoxRender() {
  return (
    <Box
      render={<section />}
      aria-label="Release notes"
      className="w-64 rounded-md border border-separator p-4 text-sm"
    >
      This Box renders a section element.
    </Box>
  );
}
