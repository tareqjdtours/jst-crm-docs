// Accountant 11 · The new year before the old one is closed (decision 0025, 11 Nov 2026). Reads only.
// The test copy holds three 2025 vouchers and 2025 is not closed, so 2026 opens with 2025 carried in.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/11/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open({ width: 1600, height: 900 });
  await p.getByRole('button', { name: /^Reports$/ }).nth(1).click(); await p.waitForTimeout(800);
  await p.getByRole('button', { name: 'Trial Balance' }).click(); await p.waitForTimeout(2000);
  const picker = p.getByLabel(/Financial year/).first();
  const strip = p.getByText(/opening balances include/).first().locator('xpath=ancestor::div[1]');
  console.log('picker options:', await picker.locator('option').allInnerTexts());
  await L.shot(p, OUT + '01-picker.png', [
    { box: await L.box(picker), text: 'The year you are working in', side: 'below', gap: 60, shift: -120, maxw: 200, n: 1 },
    { box: await L.box(strip), text: 'Every accounting report says which year, and what it carries in', side: 'below', gap: 50, shift: -300, maxw: 280, n: 2 },
  ], { x: 0, y: 0, width: 1600, height: 560 });
  await picker.selectOption({ label: (await picker.locator('option').allInnerTexts()).find((t) => t.startsWith('2025')) });
  await p.waitForTimeout(2000);
  const from = p.getByLabel('From'), upTo = p.getByLabel('Up To');
  console.log('2025 strip:', (await p.locator('main').innerText()).split('\n').slice(0, 6).join(' | '));
  await L.shot(p, OUT + '02-old-year.png', [
    { box: await L.box(picker), text: 'Pick 2025 to work in the old year', side: 'below', gap: 60, shift: -120, maxw: 200, n: 3 },
    { box: await L.box(from, upTo), text: 'The dates stay inside that year', side: 'below', gap: 50, shift: 120, maxw: 220, n: 4 },
  ], { x: 0, y: 0, width: 1600, height: 760 });
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
