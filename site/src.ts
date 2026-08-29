import './style.css';

declare const __BUILD_ID__: string;
type Asset = { name: string; browser_download_url: string };
type Release = { tag_name: string; assets?: Asset[] };
type CachedRelease = { at: number; release: Release };
const CACHE_KEY = 'bench-bin-bom:release:v1';
const HOUR = 3_600_000;
const releasePage = 'https://github.com/B-Divyesh/sf-bench-bin-bom/releases';
const button = document.querySelector<HTMLAnchorElement>('#download')!;
const note = document.querySelector<HTMLElement>('#download-note')!;
const platform = navigator.userAgent.includes('Windows') ? 'windows' : navigator.userAgent.includes('Mac') ? 'macos' : 'linux';
const macArchitecture = /(?:Intel Mac|x86_64|x64)/i.test(navigator.userAgent) ? 'x64' : /(?:aarch64|arm64|arm)/i.test(navigator.userAgent) ? 'aarch64' : 'x64';

function readCache(): CachedRelease | null {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); }
  catch { return null; }
}
function showRelease(release: Release) {
  const needle = platform === 'windows' ? '.msi' : platform === 'macos' ? `${macArchitecture}.dmg` : '.appimage';
  const asset = release.assets?.find((item) => item.name.toLowerCase().includes(needle));
  if (!asset) return false;
  button.href = asset.browser_download_url;
  button.textContent = `Download for ${platform === 'macos' ? 'macOS' : platform === 'windows' ? 'Windows' : 'Linux'}`;
  button.setAttribute('aria-label', `${button.textContent} (downloads from GitHub)`);
  note.textContent = `Version ${release.tag_name.replace(/^v/, '')}. The installer is unsigned. Downloads from GitHub.`;
  return true;
}
const cached = readCache();
if (cached && Date.now() - cached.at < HOUR && showRelease(cached.release)) {
  // A fresh cache avoids an unnecessary GitHub API request.
} else {
  fetch('https://api.github.com/repos/B-Divyesh/sf-bench-bin-bom/releases/latest')
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Release lookup failed')))
    .then((release: Release) => {
      if (!showRelease(release)) throw new Error('No matching installer');
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), release }));
    })
    .catch(() => {
      if (cached && showRelease(cached.release)) note.textContent += ' Showing the last saved release.';
      else {
        button.href = releasePage;
        button.textContent = 'See release downloads';
        button.setAttribute('aria-label', 'See release downloads on GitHub (external site)');
        note.textContent = 'Downloads are being published. Open the GitHub release page to check again.';
      }
    });
}
document.querySelectorAll<HTMLElement>('[data-build-id]').forEach((element) => { element.textContent = __BUILD_ID__; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
