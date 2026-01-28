/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'Service Connect Automotive',
          short_name: 'Service Connect',
          description: 'Automotive Service Marketplace',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || '')
    },
    server: {
      hmr: {
        overlay: true
      }
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress certain warnings
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
          warn(warning)
        },
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router': ['@tanstack/react-router'],
            'query': ['@tanstack/react-query'],
            'ui': ['framer-motion', 'lucide-react'],
          }
        }
      },
      // Enable source maps for production debugging
      sourcemap: false,
      // Chunk size warning limit
      chunkSizeWarningLimit: 500,
    },
  }
})
