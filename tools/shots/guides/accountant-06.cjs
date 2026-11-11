// Accountant 06 · Pay several suppliers at once (payment run). Pays what is left in To pay:
// the Example Hotel Amman invoice for file 13 and the Example Coaches invoice C-2001. NOPOST=1 stops before posting.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/06/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Inbox');
  const tab = p.getByRole('tab', { name: /To pay/ });
  await tab.click(); await p.waitForTimeout(900);
  const rows = p.locator('tr').filter({ has: p.locator('input[type=checkbox]') });
  await L.blur(rows.filter({ hasNotText: /Example/ }));
  const hotel = rows.filter({ hasText: 'JV-26-0015' }).first();
  const coach = rows.filter({ hasText: 'C-2001' }).first();
  await L.shot(p, OUT + '01-to-pay.png', [
    { box: await L.box(tab), text: 'Inbox → To pay: approved invoices not paid yet', side: 'above', gap: 4, shift: 60, maxw: 300 },
    { box: await L.box(hotel.locator('td').nth(2), hotel.locator('td').last()), text: 'Who, which file, when it is due and how much', side: 'below', gap: 130, shift: 330, maxw: 240 },
  ]);
  await hotel.locator('input[type=checkbox]').check();
  await coach.locator('input[type=checkbox]').check();
  await L.pick(p, p.locator('body'), 'From', 'Arab Bank JD');
  await p.waitForTimeout(400);
  const runBtn = p.getByRole('button', { name: /Post payment run/ });
  await L.shot(p, OUT + '02-run.png', [
    { box: await L.box(hotel.locator('input[type=checkbox]'), coach.locator('input[type=checkbox]')), text: 'Tick each invoice to pay', side: 'below', gap: 120, maxw: 200 },
    { box: await L.box(p.getByRole('combobox', { name: 'From' })), text: 'The bank you pay from', side: 'below', gap: 300, shift: -40, maxw: 200 },
    { box: await L.box(runBtn), text: 'Click Post payment run. It posts at once', side: 'below', gap: 210, shift: 160, maxw: 220 },
  ]);
  if (process.env.NOPOST) { await browser.close(); return; }
  await runBtn.click(); await p.waitForTimeout(2000);
  const toast = p.getByText(/payments? posted$/).first();
  await L.shot(p, OUT + '03-posted.png', [
    { box: await L.box(toast), text: 'One payment per supplier is posted', side: 'above', gap: 60, maxw: 240 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
