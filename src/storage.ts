import { AppState, blankState, sampleState } from './domain';

export const REAL_STORAGE_KEY = 'bench-bin-bom:v1';
export const DEMO_STORAGE_KEY = 'demo:bench-bin-bom:v1';
const DEMO_RELOAD_KEY = 'demo:bench-bin-bom:reload';
export function isDemoMode() {
  return location.pathname === '/demo' || location.pathname.startsWith('/demo/') || new URLSearchParams(location.search).get('demo') === '1';
}
export function isContinuingDemoNavigation() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (navigation?.type === 'reload') return true;
  try {
    const referrer = new URL(document.referrer);
    return referrer.origin === location.origin && (referrer.pathname === '/demo' || referrer.pathname.startsWith('/demo/') || referrer.searchParams.get('demo') === '1');
  } catch { return false; }
}
export function resumeDemoState() {
  if (!isDemoMode()) return;
  const saved = sessionStorage.getItem(DEMO_RELOAD_KEY);
  if (saved && isContinuingDemoNavigation()) localStorage.setItem(DEMO_STORAGE_KEY, saved);
  else if (!isContinuingDemoNavigation()) localStorage.removeItem(DEMO_STORAGE_KEY);
  sessionStorage.removeItem(DEMO_RELOAD_KEY);
}
export function suspendDemoState() {
  if (!isDemoMode()) return;
  const saved = localStorage.getItem(DEMO_STORAGE_KEY);
  if (saved) sessionStorage.setItem(DEMO_RELOAD_KEY, saved);
  else sessionStorage.removeItem(DEMO_RELOAD_KEY);
  localStorage.removeItem(DEMO_STORAGE_KEY);
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
export function resetDemo() {
  localStorage.removeItem(DEMO_STORAGE_KEY);
  sessionStorage.removeItem(DEMO_RELOAD_KEY);
  return sampleState();
}
export function download(filename: string, body: string, type = 'text/csv') {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(new Blob([body], { type }));
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}
