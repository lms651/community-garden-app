import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/plants": "http://localhost:5000",
      "/users": "http://localhost:5000" // for adding to garden
    },
  },
});