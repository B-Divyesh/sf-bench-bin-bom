import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearDemoLicense, licenseStorage, hasLicense, restoreLicense, verifyLicense } from './license';
import { DEMO_STORAGE_KEY, REAL_STORAGE_KEY, loadState, saveState } from './storage';

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

describe('storage boundaries', () => {
  let storage: MemoryStorage;
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('sessionStorage', new MemoryStorage());
    vi.stubGlobal('location', { pathname:'/demo/', search:'' });
  });

  it('loads sample data from the demo namespace without reading real data', () => {
    storage.setItem(REAL_STORAGE_KEY, JSON.stringify({ parts:[{ name:'Private part' }], projects:[] }));
    const loaded = loadState();
    expect(loaded.parts.map((part) => part.name)).toContain('ESP32 DevKit');
    expect(loaded.parts.map((part) => part.name)).not.toContain('Private part');
    saveState(loaded);
    expect(storage.getItem(DEMO_STORAGE_KEY)).toContain('Workshop weather node');
    expect(storage.getItem(REAL_STORAGE_KEY)).toContain('Private part');
  });

  it('keeps demo licenses separate and discards them with the demo', () => {
    restoreLicense('demo-only-token');
    expect(storage.getItem(licenseStorage.demoToken)).toBe('demo-only-token');
    expect(storage.getItem(licenseStorage.token)).toBeNull();
    clearDemoLicense();
    expect(storage.getItem(licenseStorage.demoToken)).toBeNull();
  });

  it('turns a storage quota failure into a recovery message', () => {
    storage.setItem = () => { throw new DOMException('full', 'QuotaExceededError'); };
    expect(() => saveState({ parts:[], projects:[] })).toThrow('Remove a photo or export your CSV');
  });
});

describe('license trust', () => {
  let storage: MemoryStorage;
  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal('localStorage', storage);
    vi.stubGlobal('sessionStorage', new MemoryStorage());
    vi.stubGlobal('location', { pathname:'/', search:'', href:'http://localhost/' });
  });

  it('does not unlock a newly entered token when verification is unreachable', async () => {
    restoreLicense('totally-fake');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await verifyLicense()).toBe(false);
    expect(hasLicense()).toBe(false);
  });

  it('uses a recent valid verdict offline and does not verify twice in one day', async () => {
    storage.setItem(licenseStorage.token, 'previously-valid');
    storage.setItem(licenseStorage.verdict, JSON.stringify({ valid:true, at:Date.now() }));
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await verifyLicense()).toBe(true);
    expect(hasLicense()).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });
});
