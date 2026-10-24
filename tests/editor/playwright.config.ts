import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'editor.spec.ts',
  workers: 1,
  outputDir: '../../test-results/editor',
  use: { browserName: 'chromium', baseURL: 'http://127.0.0.1:4178', headless: true },
  webServer: {
    command: 'node tests/editor/serve.mjs',
    cwd: '../..',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: false,
  },
});
