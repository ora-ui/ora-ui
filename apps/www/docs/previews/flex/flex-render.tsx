import { Flex } from '@/registry/ui/flex';

export default function FlexRender() {
  return (
    <Flex render={<ul role="list" />} className="flex-col gap-2">
      <li className="rounded-sm bg-ui px-4 py-3 text-sm">One</li>
      <li className="rounded-sm bg-ui px-4 py-3 text-sm">Two</li>
      <li className="rounded-sm bg-ui px-4 py-3 text-sm">Three</li>
    </Flex>
  );
}
