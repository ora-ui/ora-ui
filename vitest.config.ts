import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['apps/docs/vitest.config.ts'],
  },
});
