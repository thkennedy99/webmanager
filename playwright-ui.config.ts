import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/ui',
  use: { baseURL: 'http://localhost:3002' },
  projects: [{ name: 'chromium', use: { channel: 'chromium' } }],
})
