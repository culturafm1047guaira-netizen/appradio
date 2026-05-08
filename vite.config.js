import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Rádio Cultura FM 104.7',
        short_name: 'Cultura FM',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A0A12',
        theme_color: '#F5A623',
        icons: [
          {
            src: '/assets/logo-cultura-fm.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/logo-cultura-fm.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
