import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Asegura que 'global' y otros estén bien definidos
      global: 'globalthis',
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
  server: {
    proxy: {
      '/game': {
        target: 'https://api.arswpintudos.com',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
