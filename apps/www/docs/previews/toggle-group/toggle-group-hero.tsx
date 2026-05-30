import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon } from '@radix-ui/react-icons';

import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';

export default function ToggleGroupHero() {
  return (
    <div className="flex flex-col items-center gap-3">
      <ToggleGroup>
        <ToggleGroupItem value="left" aria-label="Align left">
          <TextAlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <TextAlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <TextAlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup itemVariant="outline" attached>
        <ToggleGroupItem value="left" aria-label="Align left">
          <TextAlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <TextAlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <TextAlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
