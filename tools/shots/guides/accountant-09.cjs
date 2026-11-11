// Accountant 09 · Check the trial balance. Reads only; changes nothing. A wider window so Final Cr fits.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/09/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open({ width: 1600, height: 900 });
  await p.getByRole('button', { name: /^Reports$/ }).nth(1).click(); await p.waitForTimeout(800);
  await p.getByRole('button', { name: 'Trial Balance' }).click(); await p.waitForTimeout(1500);
  await L.shot(p, OUT + '01-filters.png', [
    { box: await L.box(p.getByLabel(/Financial year/).first()), text: 'The year you are checking', side: 'below', gap: 40, shift: -140, maxw: 180 },
    { box: await L.box(p.getByLabel('From'), p.getByLabel('Up To')), text: 'The dates: usually 1 January to today', side: 'above', gap: 60, shift: 330, maxw: 240 },
    { box: await L.box(p.getByRole('button', { name: 'Trial Balance by Balances', exact: true })), text: 'The usual layout', side: 'left', gap: 30, maxw: 200 },
    { box: await L.box(p.getByRole('button', { name: 'Only posted', exact: true })), text: 'Only posted: what is really in the books', side: 'left', gap: 30, shift: 30, maxw: 200 },
  ]);
  const total = p.locator('tr', { hasText: 'Total:' }).first();
  await total.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(500);
  const diff = total.locator('xpath=following-sibling::tr[1]');
  const cells = total.locator('td');
  const n = await cells.count();
  await L.shot(p, OUT + '02-totals.png', [
    { box: await L.box(cells.nth(n - 4), cells.nth(n - 1)), text: 'Debit and credit totals must be the same', side: 'below', gap: 105, shift: 40, maxw: 240 },
    { box: await L.box(diff), text: 'The difference must be 0.000', side: 'below', gap: 50, shift: -260, maxw: 220 },
    { box: await L.box(p.locator('tbody tr').first()), text: 'Click any row to see that account’s statement', side: 'above', gap: 40, shift: -250, maxw: 240 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
