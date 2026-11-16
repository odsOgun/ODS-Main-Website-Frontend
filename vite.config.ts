import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Live ODS backend. The hackathon portal API is mounted at /api/hackathon-portal.
const LIVE_API = 'https://ods2025.onrender.com';

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
  },
  server: {
    proxy: {
      // Dev only: the live portal API accepts browser calls only from the production site (CORS),
      // so `npm run dev` reaches it server-side through this proxy (see src/hackathon-portal/lib/api.ts).
      '/hackathon-portal-api': {
        target: LIVE_API,
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/hackathon-portal-api/, '/api/hackathon-portal'),
        configure: (proxy) => {
          // A server-to-server call has no browser origin; drop the localhost one so CORS doesn't apply.
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'));
        }
      }
    }
  }
});
