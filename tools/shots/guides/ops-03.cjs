// Operations 03 · Assign a guide. File 14 (Example Group C): a Petra day on 6 Dec 2026, Italian-speaking,
// with Example Guide Sami at 60 JOD. NOSAVE=1 stops before Save; FROM=5 shoots only the saved line.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/operations/img/03/';
require('fs').mkdirSync(OUT, { recursive: true });
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label + '(?![a-z])') }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  await L.openFile(p, 'Example Group C');
  await L.fileTab(p, 'Guides');
  const row = () => p.locator('tr', { hasText: 'Example Guide Sami' }).first();
  if (process.env.FROM !== '5') {
    const add = p.getByRole('button', { name: /Add guide/ }).first();
    await add.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
    await L.shot(p, OUT + '01-guides-tab.png', [
      { box: await L.box(p.getByRole('tab', { name: /^Guides/ }).first()), text: 'Open the Guides tab', side: 'above', gap: 30, maxw: 200, n: 1 },
      { box: await L.box(add), text: 'Click Add guide', side: 'right', gap: 80, maxw: 180, n: 2 },
    ]);
    await add.click(); await p.waitForTimeout(1000);
    const d = p.locator('[role=dialog]').last();
    await field(d, 'From Date').fill('2026-12-06');
    await field(d, 'To Date').fill('2026-12-06');
    await field(d, 'Time').fill('08:00');
    await L.pick(p, d, 'Language', 'ITALIAN');
    await field(d, 'What is needed').fill('Petra full day. Italian-speaking guide, meets the group at Example Hotel Amman at 08:00.');
    await p.waitForTimeout(300);
    await L.shot(p, OUT + '02-request.png', [
      { box: await L.box(field(d, 'From Date'), field(d, 'Time')), text: 'The day and the start time. A guide line needs a time', side: 'left', gap: 40, maxw: 200, n: 1 },
      { box: await L.box(d.getByRole('combobox', { name: 'Language' })), text: 'The language the group speaks', side: 'left', gap: 40, maxw: 200, n: 2 },
      { box: await L.box(field(d, 'What is needed')), text: 'What the day is, and where to meet', side: 'left', gap: 40, maxw: 200, n: 3 },
    ]);
    const gn = d.getByRole('combobox', { name: 'Guide Name' });
    await L.scrollIn(p, gn, 200);
    await gn.click(); await p.waitForTimeout(400);
    await L.shot(p, OUT + '03-pick.png', [
      { box: await L.box(p.getByRole('listbox').first()), text: 'Each guide shows free or busy on this day. A busy guide cannot be picked', side: 'right', gap: 60, maxw: 240 },
    ]);
    await p.getByRole('option').filter({ hasText: 'Example Guide Sami' }).first().click(); await p.waitForTimeout(400);
    await field(d, 'Days').fill('1');
    await field(d, 'Daily Rate').fill('60');
    await field(d, 'Cost').fill('60'); await p.waitForTimeout(500);
    await L.scrollIn(p, gn, 200);
    await L.shot(p, OUT + '04-price.png', [
      { box: await L.box(gn), text: 'The guide', side: 'left', gap: 40, maxw: 160, n: 1 },
      { box: await L.box(field(d, 'Days'), field(d, 'Daily Rate')), text: 'How many days, and the guide’s rate', side: 'below', gap: 120, shift: 200, maxw: 200, n: 2 },
      { box: await L.box(field(d, 'Cost')), text: 'The cost of the day. Selling fills in from the profit %', side: 'left', gap: 40, maxw: 180, n: 3 },
      { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 180, n: 4 },
    ]);
    if (process.env.NOSAVE) { await browser.close(); return; }
    await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(1800);
  }
  await row().evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '05-saved.png', [
    { box: await L.box(row()), text: 'The guide is booked for the day. Click the row to change it', side: 'below', gap: 60, shift: 200, maxw: 260 },
  ]);
  await browser.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
