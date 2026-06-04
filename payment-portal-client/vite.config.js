/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  server: !isCI ? {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7278',
        changeOrigin: true,
        secure: false,
      }
    }
  } : {},
})*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const keyPath = path.resolve(__dirname, 'localhost-key.pem')
const certPath = path.resolve(__dirname, 'localhost.pem')
const hasSSL = fs.existsSync(keyPath) && fs.existsSync(certPath)
const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  server: (!isCI && hasSSL) ? {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7278',
        changeOrigin: true,
        secure: false,
      }
    }
  } : {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://localhost:7278',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})