import { AppState, blankState, sampleState } from './domain';

export const REAL_STORAGE_KEY = 'bench-bin-bom:v1';
export const DEMO_STORAGE_KEY = 'demo:bench-bin-bom:v1';
export function isDemoMode() {
  return location.pathname === '/demo' || location.pathname.startsWith('/demo/') || new URLSearchParams(location.search).get('demo') === '1';
}
export function storageKey() { return isDemoMode() ? DEMO_STORAGE_KEY : REAL_STORAGE_KEY; }
export function loadState(): AppState {
  const fallback = isDemoMode() ? sampleState() : blankState();
  try {
    const saved = localStorage.getItem(storageKey());
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch { return fallback; }
}
export function saveState(state: AppState) {
  try { localStorage.setItem(storageKey(), JSON.stringify(state)); }
  catch (error) {
    if (error instanceof DOMException && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      throw new Error('This device has no room for that change. Remove a photo or export your CSV, then try again.');
    }
    throw error;
  }
}
export function resetDemo() { localStorage.removeItem(DEMO_STORAGE_KEY); return sampleState(); }
export function download(filename: string, body: string, type = 'text/csv') {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([body], { type }));
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}
