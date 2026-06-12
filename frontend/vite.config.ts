import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['monaco-editor', '@monaco-editor/react'],
  },
  worker: {
    format: 'es',
  },
});
