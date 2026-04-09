import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/layout': resolve(__dirname, 'src/layout'),
      '@/types': resolve(__dirname, 'src/types/index.ts'),
      '@/legos': resolve(__dirname, 'src/legos'),
    },
  },
  define: {
    'process.env': {},
  },
});
