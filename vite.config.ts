import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      host: '172.20.10.7',
      port: 5173,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
