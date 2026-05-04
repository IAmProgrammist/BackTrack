import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy requests starting with '/api' to a backend server
      '/api': {
        target: 'http://localhost', // The address of your backend server
        changeOrigin: true, // Rewrites the Host header to the target URL
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  }
})
