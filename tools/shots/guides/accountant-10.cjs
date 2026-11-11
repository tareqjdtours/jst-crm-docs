// Accountant 10 · Close the year (period close). Proposes the closing entry to 31 Dec 2026 and shows it
// waiting in To approve. It does NOT approve it. NOPROPOSE=1 stops before proposing.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/10/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Inbox');
  const card = p.getByText('Period close', { exact: true }).locator('xpath=ancestor::div[.//button[normalize-space()="Propose closing entry"]][1]');
  const date = card.locator('input[type=date]');
  const btn = p.getByRole('button', { name: 'Propose closing entry' });
  await L.shot(p, OUT + '01-period-close.png', [
    { box: await L.box(date), text: 'The last day of the year you are closing', side: 'below', gap: 70, shift: 150, maxw: 240 },
    { box: await L.box(btn), text: 'Click Propose closing entry', side: 'below', gap: 50, shift: 160, maxw: 220 },
  ]);
  if (Number(process.env.FROM || 1) <= 1) {
    if (process.env.NOPROPOSE) { await browser.close(); return; }
    await btn.click(); await p.waitForTimeout(1500);
  }
  // the proposed entry waits in To approve: this guide stops before Approve
  await p.reload(); await p.waitForTimeout(2000);
  await L.nav(p, 'Inbox');
  const row = p.locator('tr', { hasText: 'Period close' }).first();
  await L.shot(p, OUT + '02-to-approve.png', [
    { box: await L.box(row.locator('td').nth(1), row.locator('td').nth(3)), text: 'The closing entry waits in To approve', side: 'below', gap: 90, shift: -60, maxw: 240 },
    { box: await L.box(row.getByRole('button', { name: 'Approve' })), text: 'Approve posts it. Send back if it looks wrong', side: 'below', gap: 90, shift: -80, maxw: 240 },
  ]);
  await row.locator('td').nth(3).click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  const line = (t) => d.locator('tr', { hasText: t }).first();
  await L.shot(p, OUT + '03-check.png', [
    { box: await L.box(line('TRIP EXPENSES'), line('incoming Revenue')), text: 'Each revenue and expense account is brought to zero', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(line('Profit & Loss')), text: 'The year’s profit goes to Profit & Loss (retained)', side: 'left', gap: 60, shift: 40, maxw: 200 },
    { box: await L.box(d.getByRole('button', { name: 'Approve & post' })), text: 'Approve & post only when the year is final', side: 'left', gap: 300, maxw: 240 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
