export const RADIUS_STORAGE_KEY = 'playground:radius';

export const DEFAULT_RADIUS = 'md';

export const RADIUS_STEPS = [
  { value: 'none', label: 'None', radius: '0px' },
  { value: 'sm', label: 'Small', radius: '0.25rem' },
  { value: 'md', label: 'Medium', radius: '0.375rem' },
  { value: 'lg', label: 'Large', radius: '0.75rem' },
  { value: 'full', label: 'Full', radius: '9999px' },
] as const;

/*
 * Runs while the document is still parsing, so the stored radius is on :root
 * before the first paint instead of after hydration.
 */
export const RADIUS_INIT_SCRIPT = `try{var r=${JSON.stringify(
  Object.fromEntries(RADIUS_STEPS.map((s) => [s.value, s.radius]))
)}[localStorage.getItem(${JSON.stringify(RADIUS_STORAGE_KEY)})];if(r)document.documentElement.style.setProperty('--radius',r)}catch(e){}`;
