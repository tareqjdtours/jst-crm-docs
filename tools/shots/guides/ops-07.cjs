// Operations 07 · Reminders. File 12 (Example Group A): Payment to Camp moved to 5 Nov with a note, and
// Agent Invoice marked done. NOSAVE=1 stops before the first change; FROM=3 shoots only the result.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/07/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.nav(p, 'Reminders');
  const m = p.locator('main');
  const rowOf = (type) => m.locator('tr').filter({ hasText: 'Example Group A' }).filter({ hasText: type }).first();
  const inv = rowOf('Agent Invoice');
  if (process.env.FROM !== '3') {
  await inv.hover(); await p.waitForTimeout(300);
  await L.shot(p, OUT + '01-list.png', [
    { box: await L.box(m.getByText('Overdue', { exact: true }), m.getByText('Raised by the system', { exact: true })), text: 'Overdue, due today, coming up', side: 'below', gap: 30, shift: -300, maxw: 200, n: 1 },
    { box: await L.box(m.locator('label', { hasText: /^Due from/ }).locator('input'), m.getByText('Show done', { exact: true })), text: 'Filter by date or owner. Due now shows only what is due', side: 'above', gap: 40, shift: 300, maxw: 240, n: 2 },
    { box: await L.box(inv.getByText('auto')), text: 'auto: raised by the system from the arrival date', side: 'below', gap: 100, shift: -60, maxw: 200, n: 3 },
    { box: await L.box(inv.getByRole('button', { name: /Example Group A/ })), text: 'Click the file to open it', side: 'below', gap: 100, shift: 60, maxw: 180, n: 4 },
    { box: await L.box(inv.getByRole('button', { name: 'Mark done' })), text: 'Mark done', side: 'left', gap: 30, maxw: 120, n: 5 },
    { box: await L.box(inv.getByRole('button', { name: 'Set date' })), text: 'Change the date, or add a note', side: 'above', gap: 60, maxw: 180, n: 6 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await rowOf('Payment to Camp').getByRole('button', { name: 'Set date' }).click(); await p.waitForTimeout(900);
  const d = p.locator('[role=dialog]').last();
  await field(d, 'Remind On').fill('2026-11-05');
  await field(d, 'Notes').fill('The camp asked to be paid on Thursday.');
  await p.waitForTimeout(300);
  await L.shot(p, OUT + '02-set-date.png', [
    { box: await L.box(field(d, 'Remind On')), text: 'The new date. It replaces the standard lead days', side: 'below', gap: 80, maxw: 220, n: 1 },
    { box: await L.box(field(d, 'Notes')), text: 'Why it moved, for whoever picks it up', side: 'below', gap: 60, shift: -200, maxw: 220, n: 2 },
    { box: await L.box(d.getByText('Done', { exact: true })), text: 'Or tick Done here', side: 'right', gap: 80, maxw: 160, n: 3 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 160, n: 4 },
  ]);
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1500);
  await inv.getByRole('button', { name: 'Mark done' }).click(); await p.waitForTimeout(1500);
  }
  const moved = rowOf('Payment to Camp');
  await L.scrollIn(p, moved, 300);
  await L.shot(p, OUT + '03-moved.png', [
    { box: await L.box(moved), text: 'At its new date, saying what it was moved from, with the note', side: 'below', gap: 60, shift: 200, maxw: 240 },
  ]);
  const sw = m.getByRole('switch');
  await sw.click(); await p.waitForTimeout(800);
  await m.getByRole('button', { name: '⏭' }).click(); await p.waitForTimeout(600);
  const done = m.locator('tr').filter({ hasText: 'Example Group A' }).filter({ hasText: 'Agent Invoice' }).first();
  await L.scrollIn(p, done, 360);
  await L.shot(p, OUT + '04-done.png', [
    { box: await L.box(m.getByText('Done', { exact: true }).last()), text: 'With Show done on, finished reminders are listed under Done', side: 'right', gap: 60, maxw: 240, n: 1 },
    { box: await L.box(done), text: 'The one you marked done. They come last, on the last page', side: 'below', gap: 40, shift: 200, maxw: 240, n: 2 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
