import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

await mkdir('assets/src', { recursive:true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{ width:1200, height:750 }, deviceScaleFactor:1 });
await page.goto('http://127.0.0.1:4173/demo/', { waitUntil:'networkidle' });
await page.screenshot({ path:'assets/src/walkthrough-stock.png' });
await page.getByRole('link', { name:/Builds/ }).click();
await page.screenshot({ path:'assets/src/walkthrough-builds.png' });
await page.getByRole('link', { name:'Open pull list' }).click();
await page.screenshot({ path:'assets/src/walkthrough-pull.png' });
await browser.close();
