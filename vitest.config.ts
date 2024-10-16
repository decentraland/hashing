import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'c8', // or 'v8' for native V8 coverage support
      reporter: ['text', 'lcov', 'json', 'html'], // Report formats you want
      reportsDirectory: './coverage', // Directory to save reports
      exclude: ['node_modules/', 'tests/'], // Optional: Exclude patterns
    },
  }
})
