import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./{app,components,lib,registry,docs,content,playground}/**/*.{ts,tsx}'],
};

export default config;
