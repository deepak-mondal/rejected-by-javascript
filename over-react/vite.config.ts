import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // customize output formats
      // include: ['src/**/*.{js,jsx,ts,tsx}'], // files to include
      // exclude: ['**/node_modules/**', '**/dist/**'], // files to exclude
    },
  }
})
