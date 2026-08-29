import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const buildId = process.env.GITHUB_SHA?.slice(0, 8) || process.env.VITE_BUILD_ID || (() => {
  try { return execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding:'utf8' }).trim(); }
  catch { return 'source'; }
})();
const appVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  build: { target: 'es2022', outDir: 'dist', sourcemap: false, cssCodeSplit: true },
  server: { host: '0.0.0.0' }
});
