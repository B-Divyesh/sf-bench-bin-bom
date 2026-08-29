import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const buildId = process.env.GITHUB_SHA?.slice(0, 8) || process.env.VITE_BUILD_ID || (() => {
  try { return execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding:'utf8' }).trim(); }
  catch { return 'source'; }
})();
const appVersion = JSON.parse(readFileSync(resolve(here, 'package.json'), 'utf8')).version;

export default defineConfig({
  root: 'site',
  publicDir: resolve(here, 'public'),
  plugins: [{
    name: 'traceable-build-id',
    transformIndexHtml(html) { return html.replaceAll('__BUILD_ID__', buildId).replaceAll('__APP_VERSION__', appVersion); }
  }],
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __APP_VERSION__: JSON.stringify(appVersion)
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
