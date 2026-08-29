import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const base = process.env.VERIFY_BASE_URL || 'https://bench-bin-bom.sociobot.in';
const evidence = new URL('../.factory/evidence/polish-2/', import.meta.url).pathname;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const browser = await chromium.launch();

try {
  const context = await browser.newContext({ viewport:{ width:390, height:844 } });
  const page = await context.newPage();
  const errors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('request', (request) => requests.push(request.url()));

  await page.goto(`${base}/`, { waitUntil:'networkidle' });
  assert(await page.title() === 'Bench Bin BOM — check parts before building', 'wrong home title');
  assert(await page.getByRole('heading', { level:1 }).textContent() === 'Check your parts before building', 'wrong home h1');
  const price = await page.getByText(/Bench Pass: \$12 once/).boundingBox();
  assert(price && price.y + price.height <= 844, 'mobile price fact is below the first screen');
  assert(await page.getByText('parts list (BOM)').count() === 1, 'BOM is not expanded on first use');
  assert(await page.getByText('Try the real workflow').count() === 0, 'generic workflow label remains');
  assert(await page.getByText('Clear boundaries').count() === 0, 'generic boundaries label remains');
  assert((await page.getByRole('link', { name:/secure Sociobot checkout/ }).getAttribute('href'))?.startsWith('https://api.sociobot.in/'), 'checkout is not externally labelled');
  assert((await page.locator('#download').getAttribute('aria-label'))?.includes('GitHub'), 'download is not externally labelled');
  let axe = await new AxeBuilder({ page }).analyze();
  assert(axe.violations.filter((item) => ['serious','critical'].includes(item.impact || '')).length === 0, 'home has serious axe violations');

  await page.evaluate(() => localStorage.setItem('bench-bin-bom:v1', JSON.stringify({ parts:[{ name:'Private live probe' }], projects:[] })));
  await page.getByRole('link', { name:'Try it with sample data' }).click();
  assert(page.url().endsWith('/demo/?demo=1'), 'demo is not one click from home');
  assert(await page.title() === 'Demo — Bench Bin BOM', 'demo title was overwritten');
  assert(await page.getByText('Demo — sample data, nothing is saved').isVisible(), 'demo banner is missing');
  for (const text of ['ESP32 DevKit', 'Pull 1 from A1', '2 short']) {
    const box = await page.locator('.demo-results').getByText(text, { exact:true }).boundingBox();
    assert(box && box.y >= 0 && box.y + box.height <= 844, `${text} is outside the first mobile screen`);
  }
  assert(await page.getByText('Private live probe').count() === 0, 'demo read real data');
  for (const name of ['Bench stock', 'Builds', 'About']) {
    const box = await page.getByRole('link', { name:new RegExp(name) }).boundingBox();
    assert(box && box.x >= 0 && box.x + box.width <= 390 && box.height >= 44, `${name} is clipped on mobile`);
  }
  axe = await new AxeBuilder({ page }).analyze();
  assert(axe.violations.filter((item) => ['serious','critical'].includes(item.impact || '')).length === 0, 'demo has serious axe violations');
  await page.screenshot({ path:`${evidence}live-cold-demo-390.png`, fullPage:true });

  await page.getByRole('link', { name:'Open the full pull list' }).click();
  await page.getByRole('button', { name:'Paste or import BOM' }).click();
  await page.getByLabel('BOM CSV file').setInputFiles({ name:'live-check.csv', mimeType:'text/csv', buffer:Buffer.from('part,value,quantity,substitute,note\nJST socket,2-pin,2,,Live import') });
  await page.getByRole('button', { name:'Import BOM rows' }).click();
  await page.getByText('JST socket').waitFor();
  await page.getByRole('button', { name:'Reset demo' }).click();
  assert(await page.getByText('JST socket').count() === 0, 'live demo reset failed');
  await page.getByRole('button', { name:'Start for real' }).click();
  assert(new URL(page.url()).pathname === '/', 'Start for real did not leave demo');
  assert((await page.evaluate(() => localStorage.getItem('bench-bin-bom:v1')))?.includes('Private live probe'), 'real data changed during demo');

  for (const [path, title, heading] of [
    ['/privacy/', 'Privacy — Bench Bin BOM', 'Privacy'],
    ['/terms/', 'Terms — Bench Bin BOM', 'Terms']
  ]) {
    const response = await page.goto(`${base}${path}`, { waitUntil:'networkidle' });
    assert(response?.status() === 200, `${path} returned ${response?.status()}`);
    assert(await page.title() === title, `${path} has wrong title`);
    assert(await page.getByRole('heading', { level:1 }).textContent() === heading, `${path} has wrong h1`);
    axe = await new AxeBuilder({ page }).analyze();
    assert(axe.violations.filter((item) => ['serious','critical'].includes(item.impact || '')).length === 0, `${path} has serious axe violations`);
  }
  const unexpectedErrors = [...errors];
  assert(unexpectedErrors.length === 0, `browser errors: ${unexpectedErrors.join(' | ')}`);
  const missing = await page.goto(`${base}/missing-polish-2-check`, { waitUntil:'networkidle' });
  assert(missing?.status() === 404, `unknown route returned ${missing?.status()}`);
  assert(await page.title() === 'Page not found — Bench Bin BOM', '404 has wrong title');
  assert(await page.getByRole('heading', { level:1 }).textContent() === 'Page not found', '404 has wrong h1');
  axe = await new AxeBuilder({ page }).analyze();
  assert(axe.violations.filter((item) => ['serious','critical'].includes(item.impact || '')).length === 0, '404 has serious axe violations');
  const demoExternal = requests.filter((url) => url.startsWith(`${base}/demo`) === false && url.startsWith(base) === false && !url.startsWith('https://api.github.com/'));
  assert(demoExternal.length === 0, `unexpected external requests: ${demoExternal.join(', ')}`);
  await context.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${base}/demo/?demo=1`);
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.getByRole('link', { name:/Builds/ }).click();
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  assert(await offlinePage.getByRole('heading', { name:'Your builds' }).isVisible(), 'offline nested route failed');
  assert(await offlinePage.getByText('Workshop weather node').isVisible(), 'offline sample is missing');
  await offlineContext.close();

  console.log(JSON.stringify({ base, errors:unexpectedErrors, result:'PASS', checks:20 }, null, 2));
} finally {
  await browser.close();
}
