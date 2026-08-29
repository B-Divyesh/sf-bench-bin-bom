import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const DEMO_KEY = 'demo:bench-bin-bom:v1';
const REAL_KEY = 'bench-bin-bom:v1';
const TOKEN_KEY = 'sb_license:bench-bin-bom';
const VERDICT_KEY = `${TOKEN_KEY}:verdict`;
const DEMO_TOKEN_KEY = 'demo:sb_license:bench-bin-bom';
const DEMO_VERDICT_KEY = `${DEMO_TOKEN_KEY}:verdict`;
const APP_VERSION = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')).version;

function fortyParts() {
  return Array.from({ length:40 }, (_, index) => ({
    id:`part-${index}`, name:`Part ${index}`, value:'', quantity:1, bin:`A${index}`, note:''
  }));
}

test('cold first screen names the job, audience, next step, and exact price', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level:1 })).toHaveText('Check your parts before building');
  await expect(page.getByText(/makers and homelab builders/)).toBeVisible();
  await expect(page.getByRole('link', { name:'Try it with sample data' })).toHaveAttribute('href', '/demo/?demo=1');
  await expect(page.getByText(/Opens an isolated sample bench and pull list/)).toBeVisible();
  await expect(page.getByText(/Bench Pass: \$12 once/)).toBeVisible();
});

test('@claim:sample-demo sample data is one click away, isolated, and discarded on exit', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({ status:200, contentType:'application/json', body:'{"valid":false,"reason":"invalid"}' }));
  await page.goto('/');
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({ parts:[{ name:'Private part' }], projects:[] })), REAL_KEY);
  await page.getByRole('link', { name:'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo\/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Bench Bin BOM');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  const samplePart = page.locator('.demo-results').getByText('ESP32 DevKit');
  const usefulResult = page.locator('.demo-results').getByText('Pull 1 from A1');
  for (const item of [samplePart, usefulResult]) {
    const box = await item.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  }
  await expect(page.getByText('Private part')).toHaveCount(0);
  await page.getByRole('button', { name:'Reset demo' }).click();
  const real = await page.evaluate((key) => localStorage.getItem(key), REAL_KEY);
  expect(real).toContain('Private part');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Demo persistence probe');
  await page.getByRole('button', { name:'Save part' }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), REAL_KEY)).toContain('Private part');
  await page.getByRole('link', { name:'Try it with sample data' }).click();
  await expect(page.getByText('Demo persistence probe')).toHaveCount(0);
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Explicit exit probe');
  await page.getByRole('button', { name:'Save part' }).click();
  await page.getByRole('link', { name:'About' }).click();
  await page.getByRole('button', { name:'Paste a license' }).click();
  await page.getByLabel('License token').fill('demo-only-token');
  await page.getByRole('button', { name:'Verify license' }).click();
  await expect(page.getByText(/could not be verified/)).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_TOKEN_KEY)).toBe('demo-only-token');
  await page.getByRole('button', { name:'Cancel' }).click();
  await page.getByRole('button', { name:'Start for real' }).click();
  await expect(page).toHaveURL('/');
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toBeNull();
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_TOKEN_KEY)).toBeNull();
  await page.goto('/demo/');
  await expect(page.getByText('Explicit exit probe')).toHaveCount(0);
});

test('@claim:sample-content the isolated demo has exactly three stock records and four BOM rows', async ({ page }) => {
  await page.goto('/demo/?demo=1');
  await expect(page.locator('.part-row')).toHaveCount(3);
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await expect(page.locator('.bom-row')).toHaveCount(4);
});

test('@claim:record-bin-locations a saved bin appears in stock and in its pull instruction', async ({ page }) => {
  await page.goto('/demo/?demo=1');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Panel jack');
  await page.getByLabel('Value or variant').fill('PJ-301M');
  await page.getByLabel('Quantity on hand').fill('2');
  await page.getByLabel('Bin location').fill('D7');
  await page.getByRole('button', { name:'Save part' }).click();
  const part = page.locator('.part-row').filter({ hasText:'Panel jack' });
  await expect(part).toContainText('D7');
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await page.getByRole('button', { name:'Add BOM line' }).click();
  await page.getByLabel('Part name').fill('Panel jack');
  await page.getByLabel('Value or variant').fill('PJ-301M');
  await page.getByLabel('Quantity needed').fill('2');
  await page.getByRole('button', { name:'Save line' }).click();
  await expect(page.locator('.bom-row').filter({ hasText:'Panel jack' })).toContainText('Pull: 2 from D7');
});

test('@claim:bom-entry-notes pasted BOM substitute notes persist beside the saved line', async ({ page, context }) => {
  await page.goto('/demo/?demo=1');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await page.getByRole('button', { name:'Paste or import BOM' }).click();
  await page.getByRole('textbox', { name:'Paste CSV rows' }).fill('JST lead,2-pin,1,"Dupont lead; check pin order",sensor cable');
  await page.getByRole('button', { name:'Import BOM rows' }).click();
  const line = page.locator('.bom-row').filter({ hasText:'JST lead' });
  await expect(line).toContainText('sensor cable');
  await expect(line).toContainText('Substitute: Dupont lead; check pin order');
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.bom-row').filter({ hasText:'JST lead' })).toContainText('Substitute: Dupont lead; check pin order');
  await context.setOffline(false);
});

test('@claim:bom-file-import a selected CSV file adds BOM rows through the existing parser', async ({ page }) => {
  await page.goto('/demo/?demo=1');
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await page.getByRole('button', { name:'Paste or import BOM' }).click();
  await page.getByLabel('BOM CSV file').setInputFiles({
    name:'weather-node-addition.csv',
    mimeType:'text/csv',
    buffer:Buffer.from('part,value,quantity,substitute,note\nJST socket,2-pin,2,,Sensor leads')
  });
  await page.getByRole('button', { name:'Import BOM rows' }).click();
  const line = page.locator('.bom-row').filter({ hasText:'JST socket' });
  await expect(line).toContainText('2-pin');
  await expect(line).toContainText('Sensor leads');
  expect(await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toContain('JST socket');
});

test('@claim:stock-shortage-check recorded stock is compared with demand and shows pull and shortage results', async ({ page }) => {
  await page.goto('/demo/?demo=1');
  await page.evaluate((key) => localStorage.setItem(key, JSON.stringify({
    parts:[{ id:'relay-stock', name:'Bench relay', value:'5V', quantity:2, bin:'B4', note:'' }],
    projects:[{ id:'relay-build', name:'Relay timer', notes:'', updatedAt:'2026-08-29T12:00:00.000Z', bom:[
      { id:'relay-line', part:'Bench relay', value:'5V', needed:3, substitute:'', note:'' }
    ] }],
    activeProjectId:'relay-build'
  })), DEMO_KEY);
  await page.reload();
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  const line = page.locator('.bom-row').filter({ hasText:'Bench relay' });
  await expect(line).toContainText('Pull: 2 from B4');
  await expect(line).toContainText('2allocated');
  await expect(line).toContainText('1 short');
});

test('@claim:bom-allocation duplicate BOM rows allocate stock only once', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  const screws = page.locator('.bom-row').filter({ hasText:'M3 screw' });
  await expect(screws).toHaveCount(2);
  await expect(screws.nth(0)).toContainText('6allocated');
  await expect(screws.nth(0)).toContainText('Ready');
  await expect(screws.nth(1)).toContainText('4allocated');
  await expect(screws.nth(1)).toContainText('2 short');
  await expect(screws.nth(0)).toContainText('Pull: 6 from C4');
  await expect(screws.nth(1)).toContainText('Pull: 4 from C4');
  await expect(page.locator('.readiness')).toContainText('2 lines to source');
});

test('Cancel and Close never save a part, including at the free limit', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Must not save');
  await page.getByRole('button', { name:'Cancel' }).click();
  await expect(page.getByText('Must not save')).toHaveCount(0);
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Must not save');
  await page.getByRole('button', { name:'Close' }).click();
  await expect(page.getByText('Must not save')).toHaveCount(0);

  await page.evaluate(({ key, parts }) => localStorage.setItem(key, JSON.stringify({ parts, projects:[] })), { key:DEMO_KEY, parts:fortyParts() });
  await page.reload();
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Over limit');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText(/free bench holds 40 parts/)).toBeVisible();
  await page.getByRole('button', { name:'Cancel' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('@claim:csv-import-export quoted CSV imports intact and exports', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name:'Import CSV' }).click();
  await page.getByRole('textbox', { name:'Paste CSV rows' }).fill('Widget,10k,-5,A1,precision');
  await page.getByRole('button', { name:'Import stock rows' }).click();
  await expect(page.getByText(/quantity must be a whole number of 0 or more/)).toBeVisible();
  await page.getByRole('textbox', { name:'Paste CSV rows' }).fill('Widget,"10k, 1%",2,A1,precision');
  await page.getByRole('button', { name:'Import stock rows' }).click();
  await expect(page.getByText('Widget')).toBeVisible();
  await expect(page.getByText('10k, 1%')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name:'Export CSV' }).click();
  const file = await download;
  const body = readFileSync(await file.path()!, 'utf8');
  expect(body).toContain('"Widget","10k, 1%","2","A1","precision"');
});

test('@claim:photo-limit large photos are rejected without closing or saving', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Large photo part');
  await page.getByLabel('Photo').setInputFiles({ name:'large.jpg', mimeType:'image/jpeg', buffer:Buffer.alloc(5 * 1024 * 1024) });
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText('That photo is larger than 2 MB. Choose a smaller image.')).toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  const saved = await page.evaluate((key) => localStorage.getItem(key), DEMO_KEY);
  expect(saved || '').not.toContain('Large photo part');
});

test('@claim:free-limits free mode enforces 40 parts and two builds', async ({ page }) => {
  await page.goto('/demo/');
  await page.evaluate(({ key, parts }) => localStorage.setItem(key, JSON.stringify({
    parts,
    projects:[
      { id:'one', name:'One', notes:'', bom:[], updatedAt:new Date().toISOString() },
      { id:'two', name:'Two', notes:'', bom:[], updatedAt:new Date().toISOString() }
    ]
  })), { key:DEMO_KEY, parts:fortyParts() });
  await page.reload();
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Part 41');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText(/free bench holds 40 parts/)).toBeVisible();
  await page.getByRole('button', { name:'Cancel' }).click();
  await page.getByRole('button', { name:'New build' }).click();
  await page.getByLabel('Build name').fill('Build three');
  await page.getByRole('button', { name:'Create pull card' }).click();
  await expect(page.getByText(/free bench includes two builds/)).toBeVisible();
});

test('a new fake license cannot unlock limits during a network failure', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.abort());
  await page.goto('/demo/?license=totally-fake');
  await page.evaluate(({ key, parts }) => localStorage.setItem(key, JSON.stringify({ parts, projects:[] })), { key:DEMO_KEY, parts:fortyParts() });
  await page.reload();
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Part 41');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText(/free bench holds 40 parts/)).toBeVisible();
});

test('@claim:paid-limits a verified Bench Pass removes record limits', async ({ page }) => {
  await page.goto('/demo/');
  await page.evaluate(({ demoKey, tokenKey, verdictKey, parts }) => {
    localStorage.setItem(demoKey, JSON.stringify({ parts, projects:[] }));
    localStorage.setItem(tokenKey, 'verified-fixture');
    localStorage.setItem(verdictKey, JSON.stringify({ valid:true, at:Date.now() }));
  }, { demoKey:DEMO_KEY, tokenKey:DEMO_TOKEN_KEY, verdictKey:DEMO_VERDICT_KEY, parts:fortyParts() });
  await page.reload();
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Part 41');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText('Part 41')).toBeVisible();
});

test('@claim:license-daily a verified result is reused for one day', async ({ page }) => {
  let requests = 0;
  await page.route('https://api.sociobot.in/**', async (route) => {
    requests += 1;
    await route.fulfill({ status:200, contentType:'application/json', body:'{"valid":true,"reason":"ok"}' });
  });
  await page.goto('/demo/');
  await page.evaluate((key) => localStorage.setItem(key, 'fixture-token'), DEMO_TOKEN_KEY);
  await page.reload();
  await expect.poll(() => requests).toBe(1);
  await page.reload();
  await page.waitForTimeout(300);
  expect(requests).toBe(1);
});

test('@claim:local-private demo core use sends no data to third parties', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') external.push(request.url());
  });
  await page.goto('/demo/');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Local photo');
  await page.getByLabel('Photo').setInputFiles({ name:'small.png', mimeType:'image/png', buffer:Buffer.from('small-local-fixture') });
  await page.getByRole('button', { name:'Save part' }).click();
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), DEMO_KEY)).toContain('data:image/png;base64');
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await page.getByRole('button', { name:'Add BOM line' }).click();
  await page.getByRole('button', { name:'Cancel' }).click();
  expect(external).toEqual([]);
});

test('@claim:offline-reload every demo app route reloads offline after the first visit', async ({ page, context }) => {
  await page.goto('/demo/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.getByRole('link', { name:/Builds/ }).click();
  await expect(page).toHaveURL(/\/demo\/builds$/);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name:'Your builds' })).toBeVisible();
  await expect(page.getByText('Workshop weather node')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:license-private license verification sends only the saved token to Sociobot', async ({ page }) => {
  const requests: URL[] = [];
  await page.route('https://api.sociobot.in/**', async (route) => {
    requests.push(new URL(route.request().url()));
    await route.fulfill({ status:200, contentType:'application/json', body:'{"valid":true,"reason":"ok"}' });
  });
  await page.goto('/demo/');
  await page.evaluate((key) => localStorage.setItem(key, 'recorded-fixture-token'), DEMO_TOKEN_KEY);
  await page.reload();
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].pathname).toBe('/api/v1/products/bench-bin-bom/verify');
  expect([...requests[0].searchParams.entries()]).toEqual([['license', 'recorded-fixture-token']]);
});

test('@claim:free-core-features CSV export, accessibility, and safety notes stay free', async ({ page }) => {
  await page.goto('/demo/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name:'Export CSV' }).click();
  await (await download).path();
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await expect(page.getByText('Substitutes need your review.')).toBeVisible();
});

test('@claim:desktop-offline local inventory and pull lists remain available with the network off', async ({ page, context }) => {
  await page.goto('/demo/');
  await context.setOffline(true);
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('Offline local part');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText('Offline local part')).toBeVisible();
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await expect(page.getByRole('heading', { name:'Workshop weather node' })).toBeVisible();
  await context.setOffline(false);
});

test('blank names are rejected and a build can be removed to free a slot', async ({ page }) => {
  await page.goto('/demo/');
  await page.getByRole('button', { name:'Add a part' }).click();
  await page.getByLabel('Part name').fill('   ');
  await page.getByRole('button', { name:'Save part' }).click();
  await expect(page.getByText('Add a part name before saving.')).toBeVisible();
  await page.getByRole('button', { name:'Cancel' }).click();
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('button', { name:'New build' }).click();
  await page.getByLabel('Build name').fill('   ');
  await page.getByRole('button', { name:'Create pull card' }).click();
  await expect(page.getByText('Add a build name before saving.')).toBeVisible();
  await page.getByRole('button', { name:'Cancel' }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await page.getByRole('button', { name:'Edit build' }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name:'Remove build' }).click();
  await expect(page.getByRole('heading', { name:'Your builds' })).toBeVisible();
  await expect(page.locator('.project-card')).toHaveCount(0);
  await page.getByRole('button', { name:'Undo' }).click();
  await expect(page.locator('.toast')).toContainText('Build restored.');
  await expect(page.locator('.toast')).not.toContainText('Part restored.');
  await expect(page.locator('.project-card')).toHaveCount(1);
});

test('@claim:price-copy Bench Pass is stated as a $12 one-time purchase', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name:'Remove record limits for $12 once' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByText('Bench Pass costs US$12 as a one-time purchase.')).toBeVisible();
});

test('@claim:checkout-destination Bench Pass opens the Sociobot checkout redirect without starting a purchase', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name:'Buy Bench Pass for $12 (external checkout)' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/bench-bin-bom/checkout');
  await expect(page.getByText('Checkout opens on an external site.')).toBeVisible();
  await page.goto('/demo/?demo=1');
  await page.getByRole('link', { name:'About' }).click();
  await expect(page.getByRole('link', { name:'Buy Bench Pass for $12 (external checkout)' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/bench-bin-bom/checkout');
  await expect(page.getByText('Checkout opens on an external site.')).toBeVisible();
  const response = await request.fetch('https://api.sociobot.in/api/v1/products/bench-bin-bom/checkout', { maxRedirects:0 });
  expect(response.status()).toBe(303);
  expect(new URL(response.headers().location).hostname).toBe('checkout.dodopayments.com');
});

test('@claim:installer-checksum both one-line installers verify SHA-256', async ({ request }) => {
  const shell = await (await request.get('/install.sh')).text();
  const powershell = await (await request.get('/install.ps1')).text();
  expect(shell).toContain('sha256sum -c');
  expect(powershell).toContain('Get-FileHash');
  expect(powershell).toContain('msiexec.exe');
  expect(powershell).not.toContain('Expand-Archive');
});

test('@claim:unsigned-installers unsigned desktop packages are disclosed before download', async ({ page }) => {
  await page.route('https://api.github.com/**', (route) => route.fulfill({
    status:200,
    contentType:'application/json',
    body:JSON.stringify({ tag_name:'v0.1.3', assets:[
      { name:'Bench.Bin.BOM_0.1.3.AppImage', browser_download_url:'https://example.test/app.AppImage' }
    ] })
  }));
  await page.goto('/');
  await expect(page.getByText('Download the unsigned installer for your computer.')).toBeVisible();
  const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/release.yml'), 'utf8');
  const landingLogic = readFileSync(resolve(process.cwd(), 'site/src.ts'), 'utf8');
  expect(landingLogic).toContain('The installer is unsigned.');
  expect(workflow).toContain('Unsigned desktop installers.');
  expect(workflow).not.toMatch(/APPLE_CERTIFICATE|WINDOWS_CERT_PFX|TAURI_SIGNING_PRIVATE_KEY/);
});

test('@claim:release-artifacts release manifest covers every desktop target and both macOS architectures', async () => {
  const directory = mkdtempSync(resolve(tmpdir(), 'bench-bin-release-'));
  try {
    const names = [
      'Bench.Bin.BOM_0.1.3_x64_en-US.msi',
      'Bench.Bin.BOM_0.1.3_amd64.AppImage',
      'Bench.Bin.BOM_0.1.3_aarch64.dmg',
      'Bench.Bin.BOM_0.1.3_x64.dmg'
    ];
    names.forEach((name) => writeFileSync(resolve(directory, name), `fixture:${name}`));
    execFileSync(process.execPath, [resolve(process.cwd(), 'scripts/create-release-manifest.mjs'), directory, 'v0.1.3', 'B-Divyesh/sf-bench-bin-bom']);
    const manifest = JSON.parse(readFileSync(resolve(directory, 'latest.json'), 'utf8'));
    expect(manifest.version).toBe('0.1.3');
    expect(Object.keys(manifest.platforms).sort()).toEqual(['linux', 'macos', 'windows']);
    expect(Object.keys(manifest.platforms.macos).sort()).toEqual(['aarch64', 'x64']);
    for (const asset of [manifest.platforms.windows, manifest.platforms.linux, manifest.platforms.macos.aarch64, manifest.platforms.macos.x64]) {
      expect(asset.url).toMatch(/^https:\/\/github\.com\/B-Divyesh\/sf-bench-bin-bom\/releases\/download\/v0\.1\.3\//);
      expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(readFileSync(resolve(directory, 'SHA256SUMS'), 'utf8').trim().split('\n')).toHaveLength(names.length);
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/release.yml'), 'utf8');
    expect(workflow).toContain('--target aarch64-apple-darwin');
    expect(workflow).toContain('--target x86_64-apple-darwin');
    expect(workflow).toContain('scripts/create-release-manifest.mjs');
  } finally {
    rmSync(directory, { recursive:true, force:true });
  }
});

test('@claim:planning-only the product does not order parts or report electrical compatibility', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Bench Bin BOM does not order parts or confirm electrical compatibility.')).toBeVisible();
  await page.goto('/demo/');
  await page.getByRole('link', { name:/Builds/ }).click();
  await page.getByRole('link', { name:'Open pull list' }).click();
  await expect(page.getByText('Substitutes need your review.')).toBeVisible();
  await expect(page.getByText('Check ratings, pinouts, and fit before use.')).toBeVisible();
});

test('mobile navigation, route focus, metadata, and accessibility pass', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/demo/');
  await page.keyboard.press('Tab');
  const skipBox = await page.getByRole('link', { name:'Skip to workspace' }).boundingBox();
  expect(skipBox?.width).toBeGreaterThanOrEqual(44);
  expect(skipBox?.height).toBeGreaterThanOrEqual(44);
  for (const name of ['Bench stock', 'Builds', 'About']) {
    const link = page.getByRole('link', { name:new RegExp(name) });
    await expect(link).toBeVisible();
    const box = (await link.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
  }
  await page.getByRole('link', { name:/Builds/ }).click();
  await expect(page).toHaveURL(/\/demo\/builds$/);
  await expect(page).toHaveTitle('Builds — Bench Bin BOM');
  await expect(page.getByRole('heading', { level:1 })).toBeFocused();
  const termsBox = await page.getByRole('link', { name:'Terms' }).boundingBox();
  expect(termsBox?.width).toBeGreaterThanOrEqual(44);
  expect(termsBox?.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
});

test('desktop landing, keyboard focus, reduced motion, and text resize pass', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious','critical'].includes(item.impact || ''))).toEqual([]);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name:'Skip to content' })).toBeFocused();
  await page.emulateMedia({ reducedMotion:'reduce' });
  expect(await page.locator('.primary').first().evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('390 px landing keeps complete navigation and all first-screen facts in view', async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name:'Main navigation' });
  for (const name of ['Demo', 'Steps', 'Install', 'Privacy']) {
    const box = await navigation.getByRole('link', { name, exact:true }).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  const price = await page.getByText(/Bench Pass: \$12 once/).boundingBox();
  expect(price).not.toBeNull();
  expect(price!.y + price!.height).toBeLessThanOrEqual(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('reviewed landing and README copy stays plain and self-explanatory', async ({ page }) => {
  const readme = readFileSync(resolve(process.cwd(), 'README.md'), 'utf8');
  expect(readme).toContain('Bench Bin BOM is a desktop app for makers and homelab builders.');
  expect(readme).toContain('The demo uses separate storage and never reads real data.');
  expect(readme).toContain('project parts list (BOM)');
  expect(readme).toContain('The app does not track how you use it.');
  expect(readme).toContain('Run the browser checks with `npm run test:e2e`.');
  expect(readme).toContain('The landing page checks GitHub for the latest release');
  expect(readme).not.toContain('Tauri desktop app');
  expect(readme).not.toContain('CORS-enabled');
  expect(readme).not.toContain('WebView');
  expect(readme).not.toContain('release matrix');
  expect(readme).not.toContain('registered claim');
  await page.goto('/');
  await expect(page.getByRole('heading', { name:'How to create a pull list from your parts' })).toBeVisible();
  await expect(page.getByRole('heading', { name:'What Bench Bin BOM does not check' })).toBeVisible();
  await expect(page.locator('figcaption')).toHaveCount(0);
  await expect(page.getByText('Try the real workflow')).toHaveCount(0);
  await expect(page.getByText('Clear boundaries')).toHaveCount(0);
  await expect(page.getByText('parts list (BOM)')).toBeVisible();
  await expect(page.getByText('Checkout opens on an external site.')).toBeVisible();
  await expect(page.getByText('Your operating system may ask you to confirm it.')).toHaveCount(0);
  await expect(page.getByRole('link', { name:'Buy Bench Pass for $12 (external checkout)' })).toBeVisible();
  await expect(page.getByRole('link', { name:'View source on GitHub (opens external site)' })).toBeVisible();
});

test('legal, metadata, clean artifact, and response policy files are complete', async ({ page }) => {
  for (const [route, title, heading] of [['/privacy/', 'Privacy — Bench Bin BOM', 'Privacy'], ['/terms/', 'Terms — Bench Bin BOM', 'Terms'], ['/404.html', 'Page not found — Bench Bin BOM', 'Page not found']]) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level:1 })).toHaveText(heading);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
  }
  const root = resolve(process.cwd(), 'dist/site');
  for (const file of ['404.html','privacy/index.html','terms/index.html','demo/index.html','assets/bench-diorama-v1.webp','install.sh','install.ps1','favicon.ico','robots.txt','sitemap.xml','staticwebapp.config.json']) {
    expect(() => readFileSync(resolve(root, file))).not.toThrow();
  }
  const config = JSON.parse(readFileSync(resolve(root, 'staticwebapp.config.json'), 'utf8'));
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['Permissions-Policy']).toBeTruthy();
  expect(config.routes.find((route: { route:string }) => route.route === '/assets/*').headers['Cache-Control']).toContain('immutable');
});

test('all public routes load with one H1 and no browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const route of ['/', '/demo/', '/privacy/', '/terms/']) {
    await page.goto(route, { waitUntil:'networkidle' });
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    expect(await page.title()).not.toBe('');
  }
  expect(errors).toEqual([]);
});

test('public navigation, legal links, titles, focus, and 404 remain real routes', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Bench Bin BOM — check parts before building');
  await expect(page.getByRole('link', { name:'View source on GitHub (opens external site)' })).toHaveAttribute('href', /^https:\/\/github\.com\//);
  for (const [route, title] of [['/privacy/', 'Privacy — Bench Bin BOM'], ['/terms/', 'Terms — Bench Bin BOM']]) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('link', { name:'Privacy', exact:true }).first()).toHaveAttribute('href', '/privacy/');
    await expect(page.getByRole('link', { name:'Terms', exact:true }).last()).toHaveAttribute('href', '/terms/');
  }
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Bench Bin BOM');
  await expect(page.getByRole('heading', { level:1 })).toHaveText('Page not found');
  const config = JSON.parse(readFileSync(resolve(process.cwd(), 'dist/site/staticwebapp.config.json'), 'utf8'));
  expect(config.responseOverrides['404'].rewrite).toBe('/404.html');
  await page.goto('/demo/?demo=1');
  await expect(page).toHaveTitle('Demo — Bench Bin BOM');
  await expect(page.getByText(new RegExp(`Built by Param Factory · v${APP_VERSION}`))).toBeVisible();
  await page.getByRole('link', { name:/Builds/ }).click();
  await expect(page.getByRole('heading', { level:1 })).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level:1 })).toBeFocused();
});

test('@claim:release-cache landing release lookup uses its one-hour cache and calm fallback', async ({ page }) => {
  let calls = 0;
  await page.route('https://api.github.com/**', (route) => { calls += 1; return route.abort(); });
  await page.addInitScript(() => {
    if (sessionStorage.getItem('cache-seeded')) return;
    sessionStorage.setItem('cache-seeded', '1');
    localStorage.setItem('bench-bin-bom:release:v1', JSON.stringify({
      at:Date.now(),
      release:{ tag_name:'v9.9.9', assets:[
        { name:'bench-bin-bom.AppImage', browser_download_url:'https://example.test/app.AppImage' },
        { name:'bench-bin-bom.msi', browser_download_url:'https://example.test/app.msi' },
        { name:'bench-bin-bom.dmg', browser_download_url:'https://example.test/app.dmg' }
      ] }
    }));
  });
  await page.goto('/');
  await expect(page.locator('#download-note')).toContainText('Version 9.9.9');
  expect(calls).toBe(0);
  await page.evaluate(() => localStorage.removeItem('bench-bin-bom:release:v1'));
  await page.reload();
  await expect(page.locator('#download-note')).toContainText('Downloads are being published');
  await expect(page.locator('#download')).toHaveAttribute('href', 'https://github.com/B-Divyesh/sf-bench-bin-bom/releases');
});

test('Intel macOS visitors receive the x64 DMG', async ({ browser }) => {
  const context = await browser.newContext({ userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/122 Safari/537.36' });
  const page = await context.newPage();
  await page.route('https://api.github.com/**', async (route) => {
    await route.fulfill({ status:200, contentType:'application/json', body:JSON.stringify({ tag_name:'v0.1.3', assets:[
      { name:'Bench.Bin.BOM_0.1.3_aarch64.dmg', browser_download_url:'https://example.test/aarch64.dmg' },
      { name:'Bench.Bin.BOM_0.1.3_x64.dmg', browser_download_url:'https://example.test/x64.dmg' },
    ] }) });
  });
  await page.goto('/');
  await expect(page.locator('#download')).toHaveAttribute('href', 'https://example.test/x64.dmg');
  await context.close();
});
