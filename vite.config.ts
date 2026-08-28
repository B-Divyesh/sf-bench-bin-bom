import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2022', outDir: 'dist', sourcemap: false, cssCodeSplit: true },
  server: { host: '0.0.0.0' }
});
