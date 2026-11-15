import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';

function localTarget() {
  /*
   * Playwright re-evaluates this config in every worker, so the port is
   * picked once in the main process and handed to workers through the env.
   */
  process.env.ORA_E2E_PORT ??= execFileSync(process.execPath, [
    path.join(__dirname, 'scripts/free-port.mjs'),
  ])
    .toString()
    .trim();
  const port = process.env.ORA_E2E_PORT;
  return {
    baseURL: `http://localhost:${port}`,
    command: `pnpm exec next dev -p ${port}`,
    env: { NEXT_DIST_DIR: '.next-e2e' },
  };
}

const target = process.env.CI
  ? { baseURL: 'http://localhost:3000', command: 'pnpm dev', env: {} }
  : localTarget();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: target.baseURL,

    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: target.command,
    url: target.baseURL,
    env: target.env,
    reuseExistingServer: false,
  },
});
