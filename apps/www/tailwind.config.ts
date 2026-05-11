import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./{app,docs,playground,registry,header}/**/*.{ts,tsx}'],
};

export default config;
