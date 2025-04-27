import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        // target: 'https://telegram-mini-app-todo-list.onrender.com',
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: true,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  }
})
