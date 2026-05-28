import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/ui/select';
import { Button } from '@/registry/ui/button';
import type { EntrySchema } from '@/playground/lib/types';

const TRACK_LABELS: Record<string, string> = {
  'midnight-city': 'Midnight City',
  redbone: 'Redbone',
  'electric-feel': 'Electric Feel',
  'instant-crush': 'Instant Crush',
  passionfruit: 'Passionfruit',
  'daily-mix-1': 'Daily Mix 1',
  'discover-weekly': 'Discover Weekly',
  'release-radar': 'Release Radar',
};

export const selectEntry: EntrySchema = {
  component: 'select',
  name: 'Select',
  variants: {
    variant: {
      values: ['soft', 'solid'],
      label: 'Variant',
      default: 'soft',
    },
    triggerVariant: {
      values: ['soft', 'outline', 'surface', 'ghost', 'solid'],
      label: 'Trigger variant',
      default: 'soft',
    },
    theme: {
      values: ['gray', 'accent'],
      label: 'Theme',
      default: 'gray',
    },
    iconPosition: {
      values: ['start', 'end'],
      label: 'Icon position',
      default: 'end',
    },
  },
  behavior: {
    alignItemWithTrigger: {
      values: ['true', 'false'],
      label: 'Align item with trigger',
      default: 'true',
    },
    multiple: {
      values: ['false', 'true'],
      label: 'Multiple',
      default: 'false',
    },
  },
  content: {
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      default: 'Select a track...',
    },
    side: {
      type: 'select',
      label: 'Side',
      values: ['bottom', 'top', 'left', 'right'],
      default: 'bottom',
    },
    groups: {
      type: 'boolean',
      label: 'Groups',
      default: false,
    },
  },
  render: function SelectRender({ variants, behavior, inputs }) {
    const variant = variants.variant as 'soft' | 'solid';
    const triggerVariant = variants.triggerVariant as
      | 'soft'
      | 'outline'
      | 'surface'
      | 'ghost'
      | 'solid';
    const theme = variants.theme as 'gray' | 'accent';
    const iconPosition = variants.iconPosition as 'start' | 'end';
    const alignItemWithTrigger = behavior.alignItemWithTrigger === 'true';
    const multiple = behavior.multiple === 'true';
    const placeholder = inputs.placeholder as string;
    const side = inputs.side as 'top' | 'bottom' | 'left' | 'right';
    const groups = inputs.groups as boolean;

    const trigger = (
      <SelectTrigger
        render={
          <Button variant={triggerVariant} className="w-56 justify-between">
            <SelectValue placeholder={placeholder}>
              {(value) => {
                if (Array.isArray(value)) {
                  if (value.length === 0) return placeholder;
                  const [first, ...rest] = value;
                  const firstLabel = TRACK_LABELS[first] ?? first;
                  return rest.length === 0 ? firstLabel : `${firstLabel} (+${rest.length} more)`;
                }
                if (!value) return placeholder;
                return TRACK_LABELS[value as string] ?? value;
              }}
            </SelectValue>
            <SelectIcon />
          </Button>
        }
      />
    );

    const content = (
      <SelectContent
        variant={variant}
        theme={theme}
        side={side}
        alignItemWithTrigger={alignItemWithTrigger}
        iconPosition={iconPosition}
      >
        {groups ? (
          <>
            <SelectGroup>
              <SelectLabel>Recently played</SelectLabel>
              <SelectItem value="midnight-city">Midnight City</SelectItem>
              <SelectItem value="redbone">Redbone</SelectItem>
              <SelectItem value="electric-feel">Electric Feel</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Made for you</SelectLabel>
              <SelectItem value="daily-mix-1">Daily Mix 1</SelectItem>
              <SelectItem value="discover-weekly">Discover Weekly</SelectItem>
              <SelectItem value="release-radar">Release Radar</SelectItem>
            </SelectGroup>
          </>
        ) : (
          <SelectGroup>
            <SelectItem value="midnight-city">Midnight City</SelectItem>
            <SelectItem value="redbone">Redbone</SelectItem>
            <SelectItem value="electric-feel">Electric Feel</SelectItem>
            <SelectItem value="instant-crush">Instant Crush</SelectItem>
            <SelectItem value="passionfruit">Passionfruit</SelectItem>
          </SelectGroup>
        )}
      </SelectContent>
    );

    return (
      <Select key={multiple ? 'multi' : 'single'} multiple={multiple}>
        {trigger}
        {content}
      </Select>
    );
  },
};
