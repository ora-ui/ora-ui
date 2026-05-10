export const RADIUS_PRESETS = [
  { label: 'None', value: '0' },
  { label: 'Small', value: '0.25rem' },
  { label: 'Medium', value: '0.375rem' },
  { label: 'Large', value: '0.625rem' },
  { label: 'Full', value: '9999px' },
] as const;

export const BACKGROUNDS = [
  { label: 'App', value: 'var(--background)' },
  { label: 'Surface 1', value: 'var(--surface-1)' },
  { label: 'Surface 2', value: 'var(--surface-2)' },
] as const;

export const BUTTON_VARIANTS = ['solid', 'outline', 'surface', 'soft', 'ghost'] as const;
export const BUTTON_THEMES = ['gray', 'accent', 'destructive'] as const;

export const BADGE_VARIANTS = ['solid', 'soft', 'outline', 'surface'] as const;
export const BADGE_THEMES = ['gray', 'accent', 'destructive'] as const;

export const INPUT_VARIANTS = ['surface', 'outline', 'soft'] as const;
export const TEXTAREA_VARIANTS = ['subtle', 'outline', 'soft'] as const;
export const KBD_VARIANTS = ['ghost', 'soft', 'surface'] as const;
export const TOGGLE_VARIANTS = ['soft', 'outline', 'solid'] as const;
export const TOGGLE_SIZES = ['sm', 'md', 'lg'] as const;

export const TABS_VARIANTS = ['solid', 'soft'] as const;

export const CHECKBOX_VARIANTS = ['solid', 'surface'] as const;
export const CHECKBOX_THEMES = ['gray', 'accent'] as const;

export const DROPDOWN_VARIANTS = ['soft', 'solid'] as const;
export const DROPDOWN_THEMES = ['gray', 'accent'] as const;
export const DROPDOWN_SCENARIOS = [
  'basic',
  'with-groups',
  'with-checkboxes',
  'with-radio',
  'with-submenu',
] as const;
