import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Прокси больше не нужен, так как мы используем абсолютный URL в api.js
    allowedHosts: ['trimly-sublime-brill.cloudpub.ru'],
  },
})