import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the app to your local Wi-Fi network
    port: 3000, // Matches your FreelanceHub default frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Points to your running backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
