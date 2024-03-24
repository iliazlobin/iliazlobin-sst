import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// https://vitest.dev/guide/
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    testTimeout: 0,
    // include: ['test/**/*.test.ts'],
    pool: 'threads',
  },
})
