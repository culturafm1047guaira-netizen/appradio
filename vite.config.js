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
        description: 'Ouça a Rádio Cultura FM 104.7 ao vivo de Guaíra/Barretos.',
        lang: 'pt-BR',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A0A12',
        theme_color: '#F5A623',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})
