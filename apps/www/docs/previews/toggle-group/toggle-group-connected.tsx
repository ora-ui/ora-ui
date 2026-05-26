import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@radix-ui/react-icons';

import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';

export default function ToggleGroupConnected() {
  return (
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
      <ToggleGroupItem value="justify" aria-label="Align justify">
        <TextAlignJustifyIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
