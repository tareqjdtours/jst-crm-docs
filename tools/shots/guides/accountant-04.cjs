// Accountant 04 · Receive money. Example Travel Ltd pays 750 JOD by bank transfer for file 12 (Example Group A).
// NOPOST=1 stops before Post receipt.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/04/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Inbox');
  const btn = p.getByRole('button', { name: 'Receive money' }).first();
  await L.shot(p, OUT + '01-inbox.png', [
    { box: await L.box(btn), text: 'Inbox → Receive money', side: 'left', gap: 30, maxw: 220 },
  ]);
  await btn.click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  await L.pick(p, d, 'Received from', 'Example Travel Ltd');
  await L.pick(p, d, /Reservation file/, '12 · Example Group A');
  await L.pick(p, d, 'Method', 'Bank transfer');
  await L.pick(p, d, 'Debit account', 'Arab Bank JD');
  await L.pick(p, d, 'Currency', 'JOD');
  await d.getByPlaceholder('bank ref, card slip…').fill('TT 55120');
  const amount = d.locator('label', { hasText: /^Amount/ }).locator('input');
  await amount.fill('750');
  await p.waitForTimeout(500);
  const combo = (name) => d.getByRole('combobox', { name });
  await L.shot(p, OUT + '02-details.png', [
    { box: await L.box(combo('Received from')), text: 'Who paid: the agent', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo(/Reservation file/)), text: 'Which file it pays for', side: 'left', gap: 60, shift: 40, maxw: 200 },
    { box: await L.box(combo('Method'), combo('Debit account')), text: 'How it came, and which bank it went into', side: 'left', gap: 60, shift: 50, maxw: 200 },
    { box: await L.box(d.getByPlaceholder('bank ref, card slip…'), amount), text: 'Bank reference, currency and amount', side: 'left', gap: 60, shift: 70, maxw: 200 },
  ]);
  const row = d.locator('tr', { hasText: 'INV-26-0002' });
  await L.shot(p, OUT + '03-match.png', [
    { box: await L.box(row), text: 'The file’s invoice is matched for you', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(d.getByText('Unmatched').locator('..')), text: 'Unmatched should be 0.000', side: 'below', gap: 40, shift: -60, maxw: 220 },
    { box: await L.box(d.getByRole('button', { name: 'Post receipt' })), text: 'Click Post receipt', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOPOST) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Post receipt' }).click(); await p.waitForTimeout(1200);
  const toast = p.getByText(/^Posted RV-/).first();
  await L.shot(p, OUT + '04-posted.png', [
    { box: await L.box(toast), text: 'Done: the receipt is posted and the invoice is paid', side: 'above', gap: 60, maxw: 260 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
