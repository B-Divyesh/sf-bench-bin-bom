import { defineConfig } from 'vite';
import { execFileSync } from 'node:child_process';

const buildId = process.env.GITHUB_SHA?.slice(0, 8) || process.env.VITE_BUILD_ID || (() => {
  try { return execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], { encoding:'utf8' }).trim(); }
  catch { return 'source'; }
})();

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildId)
  },
  build: { target: 'es2022', outDir: 'dist', sourcemap: false, cssCodeSplit: true },
  server: { host: '0.0.0.0' }
});
