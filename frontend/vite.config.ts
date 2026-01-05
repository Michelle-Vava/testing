/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      TanStackRouterVite(),
      react()
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
        }
      }
    },
    // logLevel: 'warn' // Only show warnings and errors, not info logs
  }
})
