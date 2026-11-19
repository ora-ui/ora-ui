import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteTrigger,
} from '@/registry/ui/autocomplete';
import type { EntrySchema } from '@/playground/lib/types';

const TAGS = [
  'Accessibility',
  'Animation',
  'Bug fix',
  'Design system',
  'Documentation',
  'Performance',
  'Refactor',
  'Security',
  'Testing',
  'Typography',
];

export const autocompleteEntry: EntrySchema = {
  component: 'autocomplete',
  name: 'Autocomplete',
  variants: {
    variant: {
      values: ['soft', 'solid'],
      label: 'Variant',
      default: 'soft',
    },
    theme: {
      values: ['gray', 'accent'],
      label: 'Theme',
      default: 'gray',
    },
    density: {
      values: ['none', 'compact', 'comfortable'],
      label: 'Density',
      default: 'comfortable',
    },
  },
  behavior: {
    mode: {
      values: ['list', 'both', 'inline', 'none'],
      label: 'Mode',
      default: 'list',
    },
    showTrigger: { type: 'boolean', label: 'Show trigger', default: false },
    showClear: { type: 'boolean', label: 'Show clear', default: true },
    autoHighlight: { type: 'boolean', label: 'Auto highlight', default: false },
    disabled: { type: 'boolean', label: 'Disabled', default: false },
    invalid: { type: 'boolean', label: 'Invalid', default: false },
  },
  content: {
    items: {
      type: 'list',
      label: 'Suggestions',
      itemLabel: 'Suggestion',
      itemShape: {
        label: { type: 'string', label: 'Label', default: 'Tag' },
      },
      default: TAGS.map((label) => ({ label })),
    },
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      default: 'Search tags',
    },
  },
  render: function AutocompleteRender({ variants, behavior, inputs }) {
    const variant = variants.variant as 'soft' | 'solid';
    const theme = variants.theme as string;
    const density = variants.density as 'none' | 'compact' | 'comfortable';
    const mode = behavior.mode as 'list' | 'both' | 'inline' | 'none';
    const showTrigger = behavior.showTrigger === true;
    const showClear = behavior.showClear === true;
    const autoHighlight = behavior.autoHighlight === true;
    const disabled = behavior.disabled === true;
    const invalid = behavior.invalid === true;
    const placeholder = inputs.placeholder as string;
    const items = (inputs.items as { label: string }[]).map((item) => item.label);

    return (
      <Autocomplete items={items} mode={mode} autoHighlight={autoHighlight} disabled={disabled}>
        <AutocompleteInputGroup className="w-64">
          <AutocompleteInput
            aria-label="Tag"
            aria-invalid={invalid || undefined}
            placeholder={placeholder}
          />
          {showClear && <AutocompleteClear />}
          {showTrigger && <AutocompleteTrigger />}
        </AutocompleteInputGroup>
        <AutocompleteContent variant={variant} theme={theme} density={density}>
          <AutocompleteEmpty>No suggestions found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item: string) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    );
  },
};
