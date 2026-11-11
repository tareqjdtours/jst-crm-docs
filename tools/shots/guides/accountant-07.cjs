// Accountant 07 · Book a bill by hand. Example Coaches bills 60 JOD for an extra transfer on file 12
// (Example Group A), with no service line behind it. NOPOST=1 stops before Post the bill.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/accountant/img/07/';
require('fs').mkdirSync(OUT, { recursive: true });
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Inbox');
  const btn = p.getByRole('button', { name: 'Bill', exact: true }).first();
  await L.shot(p, OUT + '01-inbox.png', [
    { box: await L.box(btn), text: 'Inbox → Bill', side: 'below', gap: 70, shift: -60, maxw: 200 },
  ]);
  await btn.click(); await p.waitForTimeout(1200);
  const d = p.locator('[role=dialog]').last();
  await d.getByRole('button', { name: 'They bill us' }).click(); await p.waitForTimeout(300);
  await L.pick(p, d, 'Account', 'Example Coaches');
  await L.pick(p, d, /Reservation file/, '12 · Example Group A');
  await d.getByPlaceholder('invoice or bill no.').fill('C-2044');
  await L.pick(p, d, 'Currency', 'JOD');
  const amount = d.locator('label', { hasText: /^Amount/ }).locator('input');
  await amount.fill('60');
  await d.getByPlaceholder('what the bill is for').fill('Extra airport transfer, 14 Nov');
  await p.waitForTimeout(400);
  const combo = (name) => d.getByRole('combobox', { name });
  await L.shot(p, OUT + '02-who.png', [
    { box: await L.box(d.getByRole('button', { name: 'They bill us' })), text: '“They bill us”: we owe them', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo('Account')), text: 'The supplier who sent the bill', side: 'left', gap: 60, shift: 20, maxw: 200 },
    { box: await L.box(combo(/Reservation file/)), text: 'The file it belongs to', side: 'left', gap: 60, shift: 30, maxw: 200 },
    { box: await L.box(d.locator('table').first()), text: 'What the file already costs with them: check their bill against it', side: 'left', gap: 60, shift: 40, maxw: 200 },
  ]);
  await d.getByRole('button', { name: 'Post the bill' }).scrollIntoViewIfNeeded();
  await amount.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-amount.png', [
    { box: await L.box(combo('Other side')), text: 'What it is for. Trip expenses is usual', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(d.getByPlaceholder('invoice or bill no.'), amount), text: 'Their bill number, currency and amount', side: 'left', gap: 60, shift: 20, maxw: 200 },
    { box: await L.box(d.getByPlaceholder('what the bill is for')), text: 'A few words on what it is', side: 'left', gap: 60, shift: 30, maxw: 200 },
    { box: await L.box(d.getByRole('button', { name: 'Post the bill' })), text: 'Click Post the bill', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOPOST) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Post the bill' }).click(); await p.waitForTimeout(1500);
  await p.getByRole('tab', { name: /To pay/ }).click(); await p.waitForTimeout(900);
  const row = p.locator('tr', { hasText: 'Example Coaches' }).first();
  await L.shot(p, OUT + '04-in-to-pay.png', [
    { box: await L.box(row), text: 'It waits in To pay until you pay it', side: 'below', gap: 120, shift: 200, maxw: 240 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
