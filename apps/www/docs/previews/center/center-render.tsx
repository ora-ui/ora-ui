import { Center } from '@/registry/ui/center';

export default function CenterRender() {
  return (
    <Center render={<figure />} className="size-40 rounded-md border border-separator">
      <figcaption className="rounded-sm bg-ui px-4 py-3 text-sm">Centred</figcaption>
    </Center>
  );
}
