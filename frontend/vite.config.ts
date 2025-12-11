import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Explicitly set the root to the 'frontend' directory where this file is located.
  // This ensures that index.html is found correctly.
  root: '.',
  plugins: [react()],
  build: {
    // The output directory for the build, relative to the root.
    outDir: 'dist',
    rollupOptions: {
      // Explicitly define the entry point for the build.
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})