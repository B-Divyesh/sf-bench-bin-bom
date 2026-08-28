const KEY = 'sb_license:bench-bin-bom'; const CACHE = `${KEY}:verdict`;
const base = 'https://api.sociobot.in/api/v1/products/bench-bin-bom';
export function captureLicense() { const token = new URLSearchParams(location.search).get('license'); if (token) { localStorage.setItem(KEY, token); history.replaceState({}, '', location.pathname); } }
export function hasLicense() { return Boolean(localStorage.getItem(KEY)); }
export async function verifyLicense() { const token = localStorage.getItem(KEY); if (!token) return false; const cached = JSON.parse(localStorage.getItem(CACHE) || 'null'); if (cached && Date.now() - cached.at < 86400000) return cached.valid; try { const response = await fetch(`${base}/verify?license=${encodeURIComponent(token)}`); const result = await response.json(); localStorage.setItem(CACHE, JSON.stringify({ valid: Boolean(result.valid), at: Date.now() })); if (!result.valid) localStorage.removeItem(KEY); return Boolean(result.valid); } catch { return cached?.valid ?? true; } }
export function restoreLicense(token: string) { localStorage.setItem(KEY, token.trim()); localStorage.removeItem(CACHE); }
