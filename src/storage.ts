import { AppState, blankState } from './domain';
const KEY = 'bench-bin-bom:v1';
export function loadState(): AppState { try { return { ...blankState(), ...JSON.parse(localStorage.getItem(KEY) || '') }; } catch { return blankState(); } }
export function saveState(state: AppState) { localStorage.setItem(KEY, JSON.stringify(state)); }
export function download(filename: string, body: string, type = 'text/csv') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type })); a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 0); }
