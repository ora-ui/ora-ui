import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./{app,components,lib,previews,content}/**/*.{ts,tsx}'],
};

export default config;
