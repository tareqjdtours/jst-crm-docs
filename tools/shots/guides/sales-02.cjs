// Sales 02 · Create a reservation file. "Example Group C" for Example Holidays Ltd, 5–9 Dec 2026, 4 adults.
// NOSAVE=1 stops before Save.
const L = require('../lib.cjs');
const OUT = __dirname + '/../../../handbooks/sales/img/02/';
require('fs').mkdirSync(OUT, { recursive: true });
// the saved file opens by itself
const after = async (browser, p) => {
  const tabs = p.getByRole('tab', { name: /^General/ }).first().locator('xpath=..');
  await L.shot(p, OUT + '04-file.png', [
    { box: await L.box(p.getByRole('heading', { name: 'Example Group C' })), text: 'The file is saved and opens. Its number is next to the agent', side: 'right', gap: 60, maxw: 260 },
    { box: await L.box(tabs), text: 'Add hotels and services on these tabs (guides 3 and 4)', side: 'above', gap: 40, shift: 300, maxw: 260 },
  ]);
  await browser.close();
};
const field = (d, label) => d.locator('label').filter({ hasText: new RegExp('^\\s*' + label) }).locator('input, textarea').first();
(async () => {
  const { browser, page: p } = await L.open();
  if (process.env.FROM === '4') { await L.openFile(p, 'Example Group C'); return after(browser, p); }
  await L.nav(p, 'Reservations');
  const btn = p.getByRole('button', { name: 'New', exact: true }).first();
  await L.shot(p, OUT + '01-reservations.png', [
    { box: await L.box(btn), text: 'Reservations → New', side: 'below', gap: 60, shift: 60, maxw: 200 },
  ]);
  await btn.click(); await p.waitForTimeout(1000);
  const d = p.locator('[role=dialog]').last();
  await field(d, 'Group Name').fill('Example Group C');
  await field(d, 'Client Name').fill('Rossi family and friends');
  await L.pick(p, d, 'Agent', 'Example Holidays Ltd');
  await field(d, 'Agent Reference').fill('EH-2026-118');
  await field(d, 'Arr. Date').fill('2026-12-05');
  await field(d, 'Arr. Time').fill('14:30');
  await field(d, 'Arr. Flight').fill('RJ 102');
  await field(d, 'Dep. Date').fill('2026-12-09');
  await field(d, 'Dep. Time').fill('10:15');
  await field(d, 'Dep. Flight').fill('RJ 101');
  await field(d, 'Adults').fill('4');
  await field(d, 'Nationality').fill('Italian');
  await p.waitForTimeout(400);
  const combo = (n) => d.getByRole('combobox', { name: n });
  await L.shot(p, OUT + '02-group.png', [
    { box: await L.box(field(d, 'Group Name')), text: 'A name everyone will recognise', side: 'left', gap: 60, maxw: 200 },
    { box: await L.box(combo('Agent'), field(d, 'Agent Reference')), text: 'The agent, and their own reference', side: 'left', gap: 60, shift: 30, maxw: 200 },
    { box: await L.box(field(d, 'Arr. Date'), field(d, 'Dep. Date')), text: 'Arrival and departure dates (times and flights if known)', side: 'left', gap: 780, maxw: 200 },
    { box: await L.box(field(d, 'Adults')), text: 'How many adults, children and infants', side: 'below', gap: 120, maxw: 220 },
  ]);
  const pct = field(d, 'Profit %');
  await pct.fill('30');
  const owner = combo('Reservation Owner');
  if (await owner.count()) { await owner.click(); await p.waitForTimeout(250); await p.getByRole('option').nth(1).click(); await p.waitForTimeout(300); }
  await pct.evaluate((e) => e.scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  await L.shot(p, OUT + '03-profit.png', [
    { box: await L.box(owner), text: 'Who looks after this file', side: 'above', gap: 40, maxw: 200 },
    { box: await L.box(pct), text: 'Your markup on cost. Selling prices are filled from it', side: 'below', gap: 70, maxw: 240 },
    { box: await L.box(d.getByRole('button', { name: 'Save', exact: true })), text: 'Click Save', side: 'left', gap: 110, maxw: 200 },
  ]);
  if (process.env.NOSAVE) { await browser.close(); return; }
  await d.getByRole('button', { name: 'Save', exact: true }).click(); await p.waitForTimeout(2000);
  await after(browser, p);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
