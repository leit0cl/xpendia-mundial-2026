import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'hero-worldcup.png'],
      // Asset masivo: cacheamos solo lo razonable y dejamos lo grande
      // (Three.js chunk) bajo demanda al primer visit.
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB por archivo
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
        runtimeCaching: [
          {
            // JSON estáticos de equipos y rosters: cache-first agresivo.
            urlPattern: ({ url }) => url.pathname.startsWith('/data/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'mundial-data-v1',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 días
            },
          },
          {
            // Fuentes de Google: stale-while-revalidate.
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-v1',
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      manifest: {
        name: 'Xpendia · Mundial 26',
        short_name: 'Mundial 26',
        description:
          'Tu Mundial 2026 en tu máquina: álbum local + pizarra táctica 3D + modo marquesina.',
        theme_color: '#46E3FF',
        background_color: '#05070b',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        lang: 'es',
        categories: ['sports', 'entertainment', 'utilities'],
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/hero-worldcup.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      devOptions: {
        enabled: false, // No service worker en dev para no romper HMR
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
