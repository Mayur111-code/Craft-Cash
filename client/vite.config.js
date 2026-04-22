import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo192.png', 'logo512.png'],
      manifest: {
        name: 'CashCraft - AI Expense Tracker',
        short_name: 'CashCraft',
        description: 'Smart AI-powered expense tracking application with yellow theme',
        theme_color: '#020617', // Bright Yellow
        background_color: '#020617', // Black background
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['finance', 'productivity', 'business'],
        screenshots: [
          {
            src: 'screenshot-1.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide'
          }
        ],
        icons: [
          { 
            src: 'pwa-64x64.png', 
            sizes: '64x64', 
            type: 'image/png',
            purpose: 'any'
          },
          { 
            src: 'pwa-192x192.png', 
            sizes: '192x192', 
            type: 'image/png',
            purpose: 'any'
          },
          { 
            src: 'pwa-512x512.png', 
            sizes: '512x512', 
            type: 'image/png',
            purpose: 'any'
          },
          { 
            src: 'pwa-512x512.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache-v1',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache-v1',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
})