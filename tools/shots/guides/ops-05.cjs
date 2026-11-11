// Operations 05 · Chase hotel confirmations. Dashboard for 3 Nov 2026 lists the stays arriving within a week
// with no hotel number; file 12 (Example Group A) is confirmed as H-60412. NOSAVE=1 stops before Save;
// FROM=4 shoots only the confirmed line.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/05/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  const row = () => p.locator('tr', { hasText: 'Example Hotel Amman' }).first();
  if (process.env.FROM !== '4') {
    await L.nav(p, 'Operations Dashboard');
    await p.locator('main input[type=date]').first().fill('2026-11-03'); await p.waitForTimeout(1200);
    const card = p.getByText(/^Hotels not confirmed/);
    await L.scrollIn(p, card, 300);
    const mine = p.getByText('Example Group A', { exact: true }).first();
    await L.shot(p, OUT + '01-dashboard.png', [
      { box: await L.box(card), text: 'Stays arriving in the next week that the hotel has not confirmed', side: 'above', gap: 40, shift: -100, maxw: 240, n: 1 },
      { box: await L.box(p.getByText('Example Hotel Amman', { exact: true }).first(), p.getByText('Not confirmed').last()), text: 'Click a row to open its file', side: 'below', gap: 120, shift: 60, maxw: 200, n: 2 },
    ]);
    await mine.click(); await p.waitForTimeout(1500);
    await L.fileTab(p, 'Hotels');
    await L.scrollIn(p, p.getByText(/still without a confirmation number/), 220);
    await L.shot(p, OUT + '02-hotels-tab.png', [
      { box: await L.box(p.getByText(/still without a confirmation number/)), text: 'The file lists every stay still without the hotel’s number', side: 'above', gap: 30, shift: -200, maxw: 260, n: 1 },
      { box: await L.box(row().getByText('Not confirmed'), row().getByText('Reference required')), text: 'Not confirmed: chase this one', side: 'below', gap: 120, shift: -120, maxw: 200, n: 2 },
      { box: await L.box(row().getByText('not asked')), text: 'Not asked yet? Send the request first (Sales handbook, guide 5)', side: 'below', gap: 120, shift: 120, maxw: 240, n: 3 },
    ]);
    await row().locator('td').nth(1).click(); await p.waitForTimeout(1200);
    const d = p.locator('[role=dialog]').last();
    await L.pick(p, d, 'Status', 'OK — CONFIRMED');
    await field(d, 'Conf. No.').fill('H-60412');
    await p.waitForTimeout(300);
    await L.scrollIn(p, field(d, 'Conf. No.'), 360);
    await L.shot(p, OUT + '03-confirm.png', [
      { box: await L.box(d.getByRole('combobox', { name: 'Status' })), text: 'Status: OK — CONFIRMED', side: 'left', gap: 40, maxw: 180, n: 1 },
      { box: await L.box(field(d, 'Conf. No.')), text: 'The hotel’s confirmation number, as in its reply', side: 'below', gap: 60, maxw: 220, n: 2 },
      { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 180, n: 3 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  } else {
    await L.openFile(p, 'Example Group A');
    await L.fileTab(p, 'Hotels');
  }
  await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '04-confirmed.png', [
    { box: await L.box(row().locator('td').nth(8)), text: 'Confirmed, with the number. The file’s warning has gone', side: 'left', gap: 330, shift: 60, maxw: 220, n: 1 },
    { box: await L.box(p.getByText(/Drop the hotel’s confirmation email/).first()), text: 'Keep the hotel’s reply here as a PDF', side: 'below', gap: 70, shift: 300, maxw: 240, n: 2 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
