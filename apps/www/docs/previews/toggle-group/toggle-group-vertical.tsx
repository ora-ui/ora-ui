import { FontBoldIcon, FontItalicIcon, UnderlineIcon } from '@radix-ui/react-icons';

import { ToggleGroup, ToggleGroupItem } from '@/registry/ui/toggle-group';

export default function ToggleGroupVertical() {
  return (
    <ToggleGroup orientation="vertical" itemVariant="outline" attached>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <FontBoldIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <FontItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
