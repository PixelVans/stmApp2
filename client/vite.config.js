import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 👈 this maps @ to /src
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Node backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
