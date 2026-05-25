import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: 'src/setupTests.ts',
    globals: true,
    environment: 'node',
    threads: false,
    testTimeout: 10000
  }
})
