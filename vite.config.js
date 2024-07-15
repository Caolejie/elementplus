import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://cn.vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: '8080',
    proxy: {
      '/api-mall': {
        target: 'http://47.102.122.191:31102',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-mall/, '')
      },
      '/api-member': {
        target: 'http://47.102.122.191:31203',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-member/, '')
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
