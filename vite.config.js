import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ Your backend
        changeOrigin: true,
        secure: false,
      }
    },
    // 👇 Add this line
    allowedHosts: [
      '9ef5365ffe27.ngrok-free.app',
    ],
  
  }
})
