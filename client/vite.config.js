import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'QuickSched',
        short_name: 'QuickSched',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4f46e5',
        icons: [
  {
    src: 'icons/logo.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'icons/logo.png',
    sizes: '512x512',
    type: 'image/png',
  },
]

      },
    }),
  ],
  server: {
    port: 5173,
  },
})
