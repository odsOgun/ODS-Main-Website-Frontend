import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Stub react/compiler-runtime for Sanity packages targeting React 19
      'react/compiler-runtime': path.resolve(__dirname, './src/stubs/compiler-runtime.ts')
    }
  },
  optimizeDeps: {
    exclude: ['sanity']
  }
});
