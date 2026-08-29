const KEY = 'sb_license:bench-bin-bom';
const CACHE = `${KEY}:verdict`;
const DAY = 86_400_000;
const base = 'https://api.sociobot.in/api/v1/products/bench-bin-bom';
type Verdict = { valid: boolean; at: number };
function cachedVerdict(): Verdict | null {
  try { return JSON.parse(localStorage.getItem(CACHE) || 'null'); }
  catch { return null; }
}
export function captureLicense() {
  const url = new URL(location.href);
  const token = url.searchParams.get('license')?.trim();
  if (!token) return false;
  localStorage.setItem(KEY, token);
  localStorage.removeItem(CACHE);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  return true;
}
/** Only a previously verified token unlocks limits while offline. */
export function hasLicense() {
  return Boolean(localStorage.getItem(KEY)) && cachedVerdict()?.valid === true;
}
export async function verifyLicense() {
  const token = localStorage.getItem(KEY);
  if (!token) return false;
  const cached = cachedVerdict();
  if (cached && Date.now() - cached.at < DAY) return cached.valid;
  try {
    const response = await fetch(`${base}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('License service unavailable');
    const result = await response.json() as { valid?: boolean };
    const valid = result.valid === true;
    localStorage.setItem(CACHE, JSON.stringify({ valid, at: Date.now() }));
    return valid;
  } catch { return cached?.valid === true; }
}
export function restoreLicense(token: string) {
  localStorage.setItem(KEY, token.trim());
  localStorage.removeItem(CACHE);
}
export const licenseStorage = { token: KEY, verdict: CACHE, day: DAY };
