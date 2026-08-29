const KEY = 'sb_license:bench-bin-bom';
const DEMO_KEY = 'demo:sb_license:bench-bin-bom';
const DAY = 86_400_000;
const base = 'https://api.sociobot.in/api/v1/products/bench-bin-bom';
type Verdict = { valid: boolean; at: number };
function isDemo() {
  return location.pathname === '/demo' || location.pathname.startsWith('/demo/') || new URLSearchParams(location.search).get('demo') === '1';
}
function keys() {
  const token = isDemo() ? DEMO_KEY : KEY;
  return { token, verdict: `${token}:verdict` };
}
function cachedVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(keys().verdict) || 'null'); }
  catch { return null; }
}
export function captureLicense() {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return false;
  const storage = keys();
  localStorage.setItem(storage.token, token);
  localStorage.removeItem(storage.verdict);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}
/** Only a previously verified token unlocks limits while offline. */
export function hasLicense() {
  return Boolean(localStorage.getItem(keys().token)) && cachedVerdict()?.valid === true;
}
export async function verifyLicense() {
  const storage = keys();
  const token = localStorage.getItem(storage.token);
  if (!token) return false;
  const cached = cachedVerdict();
  if (cached && Date.now() - cached.at < DAY) return cached.valid;
  try {
    const response = await fetch(`${base}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('License service unavailable');
    const result = await response.json() as { valid?: boolean };
    const valid = result.valid === true;
    localStorage.setItem(storage.verdict, JSON.stringify({ valid, at: Date.now() }));
    return valid;
  } catch { return cached?.valid === true; }
}
export function restoreLicense(token: string) {
  const storage = keys();
  localStorage.setItem(storage.token, token.trim());
  localStorage.removeItem(storage.verdict);
}
export function clearDemoLicense() {
  localStorage.removeItem(DEMO_KEY);
  localStorage.removeItem(`${DEMO_KEY}:verdict`);
}
export const licenseStorage = { token: KEY, verdict: `${KEY}:verdict`, demoToken: DEMO_KEY, demoVerdict: `${DEMO_KEY}:verdict`, day: DAY };
