import { Center } from '@/registry/ui/center';

export default function CenterRender() {
  return (
    <Center
      render={<section aria-label="Empty state" />}
      className="size-40 rounded-md border border-separator"
    >
      <p className="rounded-sm bg-ui px-4 py-3 text-sm">Nothing here yet</p>
    </Center>
  );
}
