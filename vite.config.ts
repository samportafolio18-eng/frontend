import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // escucha en 0.0.0.0 para que el túnel de Cloudflare pueda alcanzarlo
    port: 6644,
    strictPort: true,
    // Permite servir a través del dominio del túnel (Vite bloquea hosts no listados).
    allowedHosts: ['6644.aplicacionesdamasco.com', '.aplicacionesdamasco.com', 'localhost'],
    hmr: {
      // HMR a través de HTTPS del túnel
      host: '6644.aplicacionesdamasco.com',
      protocol: 'wss',
      clientPort: 443,
    },
  },
})
