import { Flex } from '@/registry/ui/flex';

export default function FlexHero() {
  return (
    <Flex className="items-center gap-3">
      <div className="rounded-sm bg-ui px-4 py-3 text-sm">One</div>
      <div className="rounded-sm bg-ui px-4 py-3 text-sm">Two</div>
      <div className="rounded-sm bg-ui px-4 py-3 text-sm">Three</div>
    </Flex>
  );
}
