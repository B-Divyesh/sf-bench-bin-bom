import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 8) || process.env.VITE_BUILD_ID || 'local')
  },
  build: { target: 'es2022', outDir: 'dist', sourcemap: false, cssCodeSplit: true },
  server: { host: '0.0.0.0' }
});
