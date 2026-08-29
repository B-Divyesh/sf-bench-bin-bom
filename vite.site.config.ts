import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: 'site',
  publicDir: resolve(here, 'public'),
  define: {
    __BUILD_ID__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 8) || process.env.VITE_BUILD_ID || 'local')
  },
  build: {
    target: 'es2022',
    outDir: '../dist/site',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(here, 'site/index.html'),
        demo: resolve(here, 'site/demo/index.html'),
        privacy: resolve(here, 'site/privacy/index.html'),
        terms: resolve(here, 'site/terms/index.html'),
        notFound: resolve(here, 'site/404.html')
      }
    }
  }
});
