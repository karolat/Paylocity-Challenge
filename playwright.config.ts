import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });
const authFile = path.resolve(__dirname, '.auth/user.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests due to beforeEach cleanup logic. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    baseURL: 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api',
      testMatch: /src\/tests\/api\/.*\.spec\.ts/,
      use: {
        extraHTTPHeaders: {
          Authorization: `Basic ${process.env.AUTH_TOKEN ?? ''}`,
        },
      },
    },
    {
      name: 'auth-setup',
      testMatch: /src\/tests\/setup\/auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      testIgnore: /src\/tests\/api\/.*/,
      dependencies: ['auth-setup'],
      use: { ...devices['Desktop Chrome'], storageState: authFile },
    },
  ],
});
