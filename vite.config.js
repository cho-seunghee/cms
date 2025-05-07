import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development, production)
  const env = loadEnv(mode, path.resolve(fileURLToPath(new URL('.', import.meta.url)), '.'));

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    base: env.VITE_BASE_NAME ? `/${env.VITE_BASE_NAME}/` : '/',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
    },
  };
});