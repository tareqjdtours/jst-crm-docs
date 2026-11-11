// Accountant 05 · Pay a supplier now. Example Hotel Amman is paid 400 JOD by cheque for file 12 (Example Group A),
// settling the approved hotel invoice JV-26-0016. NOPOST=1 stops before Post payment.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/05/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Inbox');
  const btn = p.getByRole('button', { name: 'Pay supplier' }).first();
  await L.shot(p, OUT + '01-inbox.png', [
    { box: await L.box(btn), text: 'Inbox → Pay supplier', side: 'below', gap: 70, shift: -40, maxw: 220 },
  ]);
  await btn.click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  await L.pick(p, d, 'Supplier', 'Example Hotel Amman');
  await L.pick(p, d, /Reservation file/, '12 · Example Group A');
  await L.pick(p, d, 'Method', 'Cheque');
  await d.locator('label', { hasText: /^Cheque no\./ }).locator('input').fill('100231');
  await L.pick(p, d, 'From', 'Arab Bank JD');
  await d.getByPlaceholder('as printed on their invoice').fill('H-7781');
  await L.pick(p, d, 'Currency', 'JOD');
  const amount = d.locator('label', { hasText: /^Amount/ }).locator('input');
  await amount.fill('400');
  await p.waitForTimeout(400);
  const combo = (name) => d.getByRole('combobox', { name });
  const nowBtn = d.getByText('Pay now', { exact: true });
  await L.shot(p, OUT + '02-details.png', [
    { box: await L.box(nowBtn), text: 'Keep “Pay now”', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo('Supplier'), combo(/Reservation file/)), text: 'The supplier, and the file the invoice is for', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo('Method'), combo('From')), text: 'How you pay, and from which bank', side: 'left', gap: 60, shift: 20, maxw: 200 },
    { box: await L.box(d.getByPlaceholder('as printed on their invoice'), amount), text: 'Date, their invoice number and the amount', side: 'left', gap: 60, shift: 40, maxw: 200 },
  ]);
  const row = d.locator('tr', { hasText: 'JV-26-0016' });
  const pay = row.locator('input[type=number]');
  await pay.fill('400');
  await p.waitForTimeout(400);
  await d.getByText('On account', { exact: true }).evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-match.png', [
    { box: await L.box(row), text: 'Type the amount next to the invoice it pays', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(d.getByText('On account', { exact: true }).locator('..')), text: 'On account should be 0.000', side: 'below', gap: 40, shift: -330, maxw: 220 },
    { box: await L.box(d.getByRole('button', { name: 'Post payment' })), text: 'Click Post payment', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOPOST) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Post payment' }).click(); await p.waitForTimeout(1200);
  const toast = p.getByText(/^Posted PV-/).first();
  await L.shot(p, OUT + '04-posted.png', [
    { box: await L.box(toast), text: 'Done: the payment is posted and the invoice is paid', side: 'above', gap: 60, maxw: 260 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
