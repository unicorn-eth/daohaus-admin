import { readFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import type { Connect, Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const APP_ASSET_ROUTES = [
  {
    route: '/favicon.ico',
    file: resolve(__dirname, 'src/favicon.ico'),
    contentType: 'image/x-icon',
  },
  {
    route: '/manifest.json',
    file: resolve(__dirname, 'src/assets/manifest.json'),
    contentType: 'application/manifest+json',
  },
  {
    route: '/images/icons/icon-72x72.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-72x72.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-96x96.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-96x96.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-128x128.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-128x128.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-144x144.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-144x144.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-152x152.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-152x152.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-192x192.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-192x192.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-384x384.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-384x384.png'),
    contentType: 'image/png',
  },
  {
    route: '/images/icons/icon-512x512.png',
    file: resolve(__dirname, 'src/assets/images/icons/icon-512x512.png'),
    contentType: 'image/png',
  },
] as const;

const appMetadataPlugin = (): Plugin => ({
  name: 'app-metadata-assets',
  configureServer(server) {
    server.middlewares.use(async (req: Connect.IncomingMessage, res, next) => {
      const url = req.url?.split('?')[0];
      const asset = APP_ASSET_ROUTES.find((entry) => entry.route === url);

      if (!asset) {
        next();
        return;
      }

      try {
        const contents = await readFile(asset.file);
        res.setHeader('Content-Type', asset.contentType);
        res.end(contents);
      } catch (error) {
        next(error as Error);
      }
    });
  },
  async generateBundle() {
    await Promise.all(
      APP_ASSET_ROUTES.map(async (asset) => {
        const source = await readFile(asset.file);
        this.emitFile({
          type: 'asset',
          fileName: asset.route.replace(/^\//, ''),
          name: basename(asset.file, extname(asset.file)),
          source,
        });
      }),
    );
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), appMetadataPlugin()],
  resolve: {
    alias: {
      '@/lib': resolve(__dirname, 'src/lib'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/pages': resolve(__dirname, 'src/pages'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/assets': resolve(__dirname, 'src/assets'),
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
