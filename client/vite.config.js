import { defineConfig } from 'vite'
import { resolve } from "path"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  alias: {
    "@": resolve(__dirname, "/src"),
  },
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
})
