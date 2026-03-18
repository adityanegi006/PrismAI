import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/webhook': {
        target: 'https://iadityanegiii.app.n8n.cloud',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})